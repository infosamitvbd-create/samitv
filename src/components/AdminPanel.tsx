import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LogIn, LogOut, Plus, Trash2, Image as ImageIcon, Layout, Send, User, MapPin, Users, Film, MessageSquare, Save, Phone, Mail, Link as LinkIcon, Upload, Edit, XCircle, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories = ['জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'বিশ্ব', 'বাণিজ্য', 'সারাদেশ', 'সরিষাবাড়ী', 'খেলাধুলা', 'বিনোদন', 'তথ্যপ্রযুক্তি', 'জামালপুর'];
const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

type AdminTab = 'dashboard' | 'news' | 'reporters' | 'media' | 'ticker' | 'ads' | 'applications' | 'messages';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

export const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const handleFirestoreError = (error: any, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    return errInfo;
  };
  
  // News State
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    category: 'জাতীয়',
    journalistName: '',
    location: ''
  });
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [newsUploadMode, setNewsUploadMode] = useState<'url' | 'file'>('url');

  // Reporter State
  const [reporters, setReporters] = useState<any[]>([]);
  const [reporterForm, setReporterForm] = useState({
    name: '',
    designation: '',
    imageUrl: '',
    location: '',
    division: 'ঢাকা',
    phone: '',
    email: ''
  });
  const [reporterImageFile, setReporterImageFile] = useState<File | null>(null);
  const [reporterUploadMode, setReporterUploadMode] = useState<'url' | 'file'>('url');

  // Media State
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [mediaForm, setMediaForm] = useState({
    title: '',
    imageUrl: '',
    type: 'image' as 'image' | 'video',
    videoUrl: ''
  });
  const [mediaImageFile, setMediaImageFile] = useState<File | null>(null);
  const [mediaUploadMode, setMediaUploadMode] = useState<'url' | 'file'>('url');

  // Ticker State
  const [tickerText, setTickerText] = useState('');
  const [isUpdatingTicker, setIsUpdatingTicker] = useState(false);

  // Ads State
  const [adsList, setAdsList] = useState<any[]>([]);
  const [adForm, setAdForm] = useState({
    title: '',
    imageUrl: '',
    link: '',
    position: 'sidebar' as 'sidebar' | 'content' | 'popup',
    active: true
  });
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adUploadMode, setAdUploadMode] = useState<'url' | 'file'>('url');

  // Applications & Messages State
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ collection: string; id: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const stats = {
    news: newsList.length,
    reporters: reporters.length,
    media: mediaList.length,
    ads: adsList.length
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // News Subscription
    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribeNews = onSnapshot(qNews, (snapshot) => {
      setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("News Subscription Error: ", error);
      showNotification("নিউজ লোড করতে সমস্যা হয়েছে। ইনডেক্স চেক করুন।", "error");
    });

    // Reporters Subscription
    const qReporters = query(collection(db, 'reporters'), orderBy('name', 'asc'));
    const unsubscribeReporters = onSnapshot(qReporters, (snapshot) => {
      setReporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Reporters Subscription Error: ", error);
      showNotification("রিপোর্টার লোড করতে সমস্যা হয়েছে।", "error");
    });

    // Media Subscription
    const qMedia = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribeMedia = onSnapshot(qMedia, (snapshot) => {
      setMediaList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Media Subscription Error: ", error);
      showNotification("মিডিয়া লোড করতে সমস্যা হয়েছে।", "error");
    });

    // Ticker Subscription
    const unsubscribeTicker = onSnapshot(doc(db, 'settings', 'ticker'), (doc) => {
      if (doc.exists()) {
        setTickerText(doc.data().text);
      }
    }, (error) => {
      console.error("Ticker Subscription Error: ", error);
    });

    // Ads Subscription
    const qAds = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
    const unsubscribeAds = onSnapshot(qAds, (snapshot) => {
      setAdsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Ads Subscription Error: ", error);
      showNotification("বিজ্ঞাপন লোড করতে সমস্যা হয়েছে।", "error");
    });

    // Applications Subscription
    const qApps = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    const unsubscribeApps = onSnapshot(qApps, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Applications Subscription Error: ", error);
    });

    // Messages Subscription
    const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Messages Subscription Error: ", error);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNews();
      unsubscribeReporters();
      unsubscribeMedia();
      unsubscribeTicker();
      unsubscribeAds();
      unsubscribeApps();
      unsubscribeMessages();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const uploadFile = async (file: File, path: string) => {
    const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      let finalImageUrl = newsForm.imageUrl;
      if (newsUploadMode === 'file' && newsImageFile) {
        finalImageUrl = await uploadFile(newsImageFile, 'news');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি দিন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), {
          ...newsForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('নিউজ সফলভাবে আপডেট হয়েছে!');
      } else {
        await addDoc(collection(db, 'news'), {
          ...newsForm,
          imageUrl: finalImageUrl,
          authorUid: user.uid,
          createdAt: serverTimestamp()
        });
        showNotification('নিউজ সফলভাবে আপলোড হয়েছে!');
      }
      setNewsForm({ title: '', content: '', imageUrl: '', category: 'জাতীয়', journalistName: '', location: '' });
      setNewsImageFile(null);
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'news');
      showNotification('নিউজ আপলোড/আপডেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReporterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = reporterForm.imageUrl;
      if (reporterUploadMode === 'file' && reporterImageFile) {
        finalImageUrl = await uploadFile(reporterImageFile, 'reporters');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি দিন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'reporters', editingId), {
          ...reporterForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('রিপোর্টার সফলভাবে আপডেট হয়েছে!');
      } else {
        await addDoc(collection(db, 'reporters'), {
          ...reporterForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('রিপোর্টার সফলভাবে যোগ করা হয়েছে!');
      }
      setReporterForm({ name: '', designation: '', imageUrl: '', location: '', division: 'ঢাকা', phone: '', email: '' });
      setReporterImageFile(null);
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reporters');
      showNotification('রিপোর্টার যোগ/আপডেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = mediaForm.imageUrl;
      if (mediaUploadMode === 'file' && mediaImageFile) {
        finalImageUrl = await uploadFile(mediaImageFile, 'media');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি দিন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'media', editingId), {
          ...mediaForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('মিডিয়া সফলভাবে আপডেট হয়েছে!');
      } else {
        await addDoc(collection(db, 'media'), {
          ...mediaForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('মিডিয়া সফলভাবে আপলোড হয়েছে!');
      }
      setMediaForm({ title: '', imageUrl: '', type: 'image', videoUrl: '' });
      setMediaImageFile(null);
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'media');
      showNotification('মিডিয়া আপলোড/আপডেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTickerUpdate = async () => {
    setIsUpdatingTicker(true);
    try {
      await setDoc(doc(db, 'settings', 'ticker'), {
        text: tickerText,
        updatedAt: serverTimestamp()
      });
      showNotification('স্ক্রলিং নিউজ আপডেট হয়েছে!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/ticker');
      showNotification('স্ক্রলিং নিউজ আপডেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsUpdatingTicker(false);
    }
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = adForm.imageUrl;
      if (adUploadMode === 'file' && adImageFile) {
        finalImageUrl = await uploadFile(adImageFile, 'ads');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি দিন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'ads', editingId), {
          ...adForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('বিজ্ঞাপন সফলভাবে আপডেট হয়েছে!');
      } else {
        await addDoc(collection(db, 'ads'), {
          ...adForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('বিজ্ঞাপন সফলভাবে আপলোড হয়েছে!');
      }
      setAdForm({ title: '', imageUrl: '', link: '', position: 'sidebar', active: true });
      setAdImageFile(null);
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'ads');
      showNotification('বিজ্ঞাপন আপলোড/আপডেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (item: any, type: AdminTab) => {
    setEditingId(item.id);
    setActiveTab(type);
    if (type === 'news') {
      setNewsForm({
        title: item.title,
        content: item.content,
        imageUrl: item.imageUrl,
        category: item.category,
        journalistName: item.journalistName || '',
        location: item.location || ''
      });
      setNewsUploadMode('url');
    } else if (type === 'reporters') {
      setReporterForm({
        name: item.name,
        designation: item.designation,
        imageUrl: item.imageUrl,
        location: item.location,
        division: item.division,
        phone: item.phone || '',
        email: item.email || ''
      });
      setReporterUploadMode('url');
    } else if (type === 'media') {
      setMediaForm({
        title: item.title,
        imageUrl: item.imageUrl,
        type: item.type,
        videoUrl: item.videoUrl || ''
      });
      setMediaUploadMode('url');
    } else if (type === 'ads') {
      setAdForm({
        title: item.title,
        imageUrl: item.imageUrl,
        link: item.link || '',
        position: item.position,
        active: item.active
      });
      setAdUploadMode('url');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewsForm({ title: '', content: '', imageUrl: '', category: 'জাতীয়', journalistName: '', location: '' });
    setReporterForm({ name: '', designation: '', imageUrl: '', location: '', division: 'ঢাকা', phone: '', email: '' });
    setMediaForm({ title: '', imageUrl: '', type: 'image', videoUrl: '' });
    setAdForm({ title: '', imageUrl: '', link: '', position: 'sidebar', active: true });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, confirmDelete.collection, confirmDelete.id));
      showNotification('সফলভাবে ডিলিট হয়েছে!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${confirmDelete.collection}/${confirmDelete.id}`);
      showNotification('ডিলিট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">লোডিং...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-sami-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} className="text-sami-blue" />
          </div>
          <h1 className="text-2xl font-bold mb-2">অ্যাডমিন লগইন</h1>
          <p className="text-gray-500 mb-8">অ্যাডমিন প্যানেল অ্যাক্সেস করতে লগইন করুন।</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-sami-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            গুগল দিয়ে লগইন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sami-blue rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <div>
              <h1 className="font-bold text-gray-900">অ্যাডমিন প্যানেল</h1>
              <p className="text-[10px] text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-lg transition-all">
            <LogOut size={18} /> লগআউট
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-sami-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Layout size={18} /> ড্যাশবোর্ড
          </button>
          <button onClick={() => setActiveTab('news')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'news' ? 'bg-sami-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Send size={18} /> নিউজ
          </button>
          <button onClick={() => setActiveTab('reporters')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'reporters' ? 'bg-sami-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Users size={18} /> আওয়ার ফ্যামিলি
          </button>
          <button onClick={() => setActiveTab('media')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'media' ? 'bg-sami-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Film size={18} /> মিডিয়া
          </button>
          <button onClick={() => setActiveTab('ticker')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'ticker' ? 'bg-sami-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <MessageSquare size={18} /> স্ক্রলিং নিউজ
          </button>
          <button onClick={() => setActiveTab('ads')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'ads' ? 'bg-sami-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <ImageIcon size={18} /> বিজ্ঞাপন
          </button>
          <button onClick={() => setActiveTab('applications')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'applications' ? 'bg-sami-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Users size={18} /> আবেদনসমূহ
          </button>
          <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'messages' ? 'bg-sami-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <MessageSquare size={18} /> মেসেজ
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Layout size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold">মোট নিউজ</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.news}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold">রিপোর্টার</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reporters}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Film size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold">মিডিয়া ফাইল</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.media}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold">বিজ্ঞাপন</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.ads}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Send size={20} className="text-sami-blue" /> সাম্প্রতিক নিউজ
                </h3>
                <div className="space-y-4">
                  {newsList.slice(0, 5).map(news => (
                    <div key={news.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                      <img src={news.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-sm">{news.title}</p>
                        <p className="text-[10px] text-gray-500">{new Date(news.createdAt?.toDate()).toLocaleDateString('bn-BD')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('news')} className="w-full mt-6 py-2 text-sami-blue font-bold text-sm hover:underline">সব নিউজ দেখুন</button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Users size={20} className="text-sami-blue" /> নতুন রিপোর্টার
                </h3>
                <div className="space-y-4">
                  {reporters.slice(0, 5).map(rep => (
                    <div key={rep.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                      <img src={rep.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{rep.name}</p>
                        <p className="text-[10px] text-sami-blue">{rep.designation}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('reporters')} className="w-full mt-6 py-2 text-sami-blue font-bold text-sm hover:underline">সব রিপোর্টার দেখুন</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
              {activeTab === 'news' && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-blue" />}
                      {editingId ? 'নিউজ আপডেট করুন' : 'নতুন নিউজ'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    <input type="text" required value={newsForm.title} onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="নিউজ টাইটেল" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" required value={newsForm.journalistName} onChange={(e) => setNewsForm({...newsForm, journalistName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="সাংবাদিকের নাম" />
                      <input type="text" required value={newsForm.location} onChange={(e) => setNewsForm({...newsForm, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="স্থান" />
                    </div>
                    <select value={newsForm.category} onChange={(e) => setNewsForm({...newsForm, category: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setNewsUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${newsUploadMode === 'url' ? 'bg-sami-blue text-white' : 'bg-gray-50 text-gray-500'}`}>URL</button>
                        <button type="button" onClick={() => setNewsUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${newsUploadMode === 'file' ? 'bg-sami-blue text-white' : 'bg-gray-50 text-gray-500'}`}>Upload</button>
                      </div>
                      {newsUploadMode === 'url' ? (
                        <input type="url" required value={newsForm.imageUrl} onChange={(e) => setNewsForm({...newsForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ইমেজ ইউআরএল" />
                      ) : (
                        <input type="file" required accept="image/*" onChange={(e) => setNewsImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                      )}
                    </div>

                    <textarea required rows={6} value={newsForm.content} onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none resize-none" placeholder="নিউজ কন্টেন্ট" />
                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? 'আপলোড হচ্ছে...' : 'পাবলিশ করুন'}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'reporters' && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-blue" />}
                      {editingId ? 'রিপোর্টার আপডেট করুন' : 'নতুন রিপোর্টার'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleReporterSubmit} className="space-y-4">
                    <input type="text" required value={reporterForm.name} onChange={(e) => setReporterForm({...reporterForm, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="নাম" />
                    <input type="text" required value={reporterForm.designation} onChange={(e) => setReporterForm({...reporterForm, designation: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="পদবী" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" required value={reporterForm.location} onChange={(e) => setReporterForm({...reporterForm, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="কর্মস্থল" />
                      <select value={reporterForm.division} onChange={(e) => setReporterForm({...reporterForm, division: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                        {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setReporterUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${reporterUploadMode === 'url' ? 'bg-sami-blue text-white' : 'bg-gray-50 text-gray-500'}`}>URL</button>
                        <button type="button" onClick={() => setReporterUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${reporterUploadMode === 'file' ? 'bg-sami-blue text-white' : 'bg-gray-50 text-gray-500'}`}>Upload</button>
                      </div>
                      {reporterUploadMode === 'url' ? (
                        <input type="url" required value={reporterForm.imageUrl} onChange={(e) => setReporterForm({...reporterForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ছবি ইউআরএল" />
                      ) : (
                        <input type="file" required accept="image/*" onChange={(e) => setReporterImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                      )}
                    </div>

                    <input type="text" value={reporterForm.phone} onChange={(e) => setReporterForm({...reporterForm, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ফোন (ঐচ্ছিক)" />
                    <input type="email" value={reporterForm.email} onChange={(e) => setReporterForm({...reporterForm, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ইমেইল (ঐচ্ছিক)" />
                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> যোগ করুন
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'media' && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-blue" />}
                      {editingId ? 'মিডিয়া আপডেট করুন' : 'নতুন মিডিয়া'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mb-6">এখানে আপলোড করা ছবি ও ভিডিও সরাসরি "মিডিয়া" পেজে দেখা যাবে।</p>
                  <form onSubmit={handleMediaSubmit} className="space-y-4">
                    <input type="text" required value={mediaForm.title} onChange={(e) => setMediaForm({...mediaForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="টাইটেল" />
                    <select value={mediaForm.type} onChange={(e) => setMediaForm({...mediaForm, type: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                      <option value="image">ছবি</option>
                      <option value="video">ভিডিও</option>
                    </select>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setMediaUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${mediaUploadMode === 'url' ? 'bg-sami-blue text-white' : 'bg-gray-50 text-gray-500'}`}>URL</button>
                        <button type="button" onClick={() => setMediaUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${mediaUploadMode === 'file' ? 'bg-sami-blue text-white' : 'bg-gray-50 text-gray-500'}`}>Upload</button>
                      </div>
                      {mediaUploadMode === 'url' ? (
                        <input type="url" required value={mediaForm.imageUrl} onChange={(e) => setMediaForm({...mediaForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="থাম্বনেইল ইমেজ ইউআরএল" />
                      ) : (
                        <input type="file" required accept="image/*" onChange={(e) => setMediaImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                      )}
                    </div>

                    {mediaForm.type === 'video' && (
                      <input type="url" required value={mediaForm.videoUrl} onChange={(e) => setMediaForm({...mediaForm, videoUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ভিডিও ইউআরএল (Youtube/Direct)" />
                    )}
                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> আপলোড করুন
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'ticker' && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageSquare size={20} className="text-sami-blue" /> স্ক্রলিং নিউজ এডিট</h2>
                  <div className="space-y-4">
                    <textarea rows={4} value={tickerText} onChange={(e) => setTickerText(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none resize-none" placeholder="ব্রেকিং নিউজ টেক্সট লিখুন..." />
                    <button onClick={handleTickerUpdate} disabled={isUpdatingTicker} className="w-full bg-sami-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Save size={18} /> {isUpdatingTicker ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'ads' && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20} className="text-sami-blue" /> নতুন বিজ্ঞাপন</h2>
                  <form onSubmit={handleAdSubmit} className="space-y-4">
                    <input type="text" required value={adForm.title} onChange={(e) => setAdForm({...adForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="বিজ্ঞাপন টাইটেল" />
                    <input type="url" value={adForm.link} onChange={(e) => setAdForm({...adForm, link: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="লিঙ্ক (ঐচ্ছিক)" />
                    
                    <select value={adForm.position} onChange={(e) => setAdForm({...adForm, position: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                      <option value="sidebar">সাইডবার</option>
                      <option value="content">নিউজ কন্টেন্ট</option>
                      <option value="popup">পপআপ</option>
                    </select>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setAdUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${adUploadMode === 'url' ? 'bg-sami-blue text-white' : 'bg-gray-50 text-gray-500'}`}>URL</button>
                        <button type="button" onClick={() => setAdUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${adUploadMode === 'file' ? 'bg-sami-blue text-white' : 'bg-gray-50 text-gray-500'}`}>Upload</button>
                      </div>
                      {adUploadMode === 'url' ? (
                        <input type="url" required value={adForm.imageUrl} onChange={(e) => setAdForm({...adForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ব্যানার ইমেজ ইউআরএল" />
                      ) : (
                        <input type="file" required accept="image/*" onChange={(e) => setAdImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                      )}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? 'আপলোড হচ্ছে...' : 'বিজ্ঞাপন পাবলিশ করুন'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Lists */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[600px]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Layout size={20} className="text-sami-blue" /> 
                {activeTab === 'news' && 'আপলোড করা নিউজসমূহ'}
                {activeTab === 'reporters' && 'রিপোর্টার তালিকা'}
                {activeTab === 'media' && 'মিডিয়া গ্যালারি'}
                {activeTab === 'ticker' && 'বর্তমান স্ক্রলিং নিউজ'}
              </h2>

              <div className="space-y-4">
                {activeTab === 'news' && newsList.map((news) => (
                  <div key={news.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                    <img src={news.imageUrl} alt="" className="w-24 h-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] bg-sami-blue/10 text-sami-blue px-2 py-0.5 rounded-full font-bold uppercase">{news.category}</span>
                      <h3 className="font-bold text-gray-900 line-clamp-1 mt-1">{news.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{news.content}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => startEditing(news, 'news')} 
                        className="flex items-center gap-1 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Edit size={14} />
                        <span>এডিট</span>
                      </button>
                      <button 
                        onClick={() => setConfirmDelete({ collection: 'news', id: news.id })} 
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Trash2 size={14} />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'reporters' && reporters.map((reporter) => (
                  <div key={reporter.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                    <img src={reporter.imageUrl} alt="" className="w-16 h-16 shrink-0 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">{reporter.name}</h3>
                      <p className="text-sm text-sami-blue font-medium">{reporter.designation}</p>
                      <p className="text-xs text-gray-500">{reporter.location} | {reporter.division}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => startEditing(reporter, 'reporters')} 
                        className="flex items-center gap-1 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Edit size={14} />
                        <span>এডিট</span>
                      </button>
                      <button 
                        onClick={() => setConfirmDelete({ collection: 'reporters', id: reporter.id })} 
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Trash2 size={14} />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'media' && mediaList.map((media) => (
                  <div key={media.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                    <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                      <img src={media.imageUrl} alt="" className="w-full h-full object-cover" />
                      {media.type === 'video' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white"><Film size={16} /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{media.title}</h3>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{media.type === 'image' ? 'ছবি' : 'ভিডিও'}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => startEditing(media, 'media')} 
                        className="flex items-center gap-1 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Edit size={14} />
                        <span>এডিট</span>
                      </button>
                      <button 
                        onClick={() => setConfirmDelete({ collection: 'media', id: media.id })} 
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Trash2 size={14} />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'ticker' && (
                  <div className="p-6 bg-sami-light rounded-2xl border border-sami-blue/20">
                    <p className="text-sami-dark font-medium italic">"{tickerText || 'কোনো টেক্সট নেই'}"</p>
                  </div>
                )}

                {activeTab === 'ads' && adsList.map((ad) => (
                  <div key={ad.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                    <img src={ad.imageUrl} alt="" className="w-24 h-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-sami-blue/10 text-sami-blue px-2 py-0.5 rounded-full font-bold uppercase">{ad.position}</span>
                        {ad.active ? (
                          <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Active</span>
                        ) : (
                          <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">Inactive</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 line-clamp-1 mt-1">{ad.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{ad.link || 'No link'}</p>
                    </div>
                    <button 
                      onClick={() => setConfirmDelete({ collection: 'ads', id: ad.id })} 
                      className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs shrink-0"
                    >
                      <Trash2 size={16} />
                      <span>ডিলিট</span>
                    </button>
                  </div>
                ))}

                {activeTab === 'applications' && applications.map((app) => (
                  <div key={app.id} className="p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img src={app.imageUrl} alt="" className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{app.name}</h3>
                          <span className="text-[10px] bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Pending</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600 mb-4">
                          <p className="flex items-center gap-2"><Phone size={14} className="text-sami-blue" /> {app.phone}</p>
                          <p className="flex items-center gap-2"><Mail size={14} className="text-sami-blue" /> {app.email || 'N/A'}</p>
                          <p className="flex items-center gap-2"><MapPin size={14} className="text-sami-blue" /> {app.location} ({app.division})</p>
                          <p className="flex items-center gap-2"><Clock size={14} className="text-sami-blue" /> {app.createdAt?.toDate()?.toLocaleString('bn-BD')}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-700 italic">
                          <p className="font-bold text-gray-900 not-italic mb-1">পূর্ব অভিজ্ঞতা:</p>
                          {app.experience || 'কোনো অভিজ্ঞতা উল্লেখ করা হয়নি।'}
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2">
                        <button 
                          onClick={() => setConfirmDelete({ collection: 'applications', id: app.id })}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={16} /> ডিলিট
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'messages' && messages.map((msg) => (
                  <div key={msg.id} className="p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sami-light text-sami-blue rounded-full flex items-center justify-center font-bold text-xl">
                          {msg.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{msg.name}</h3>
                          <p className="text-xs text-gray-500">{msg.createdAt?.toDate()?.toLocaleString('bn-BD')}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">{msg.subject}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <p className="flex items-center gap-2"><Phone size={14} className="text-sami-blue" /> {msg.phone}</p>
                      <p className="flex items-center gap-2"><Mail size={14} className="text-sami-blue" /> {msg.email || 'N/A'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed">
                      {msg.message}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => setConfirmDelete({ collection: 'messages', id: msg.id })}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Trash2 size={16} /> ডিলিট করুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>

      {/* Custom Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-[100] font-bold text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">আপনি কি নিশ্চিত?</h3>
              <p className="text-gray-500 mb-8">এটি ডিলিট করলে আর ফিরে পাওয়া যাবে না।</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  না
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  হ্যাঁ, ডিলিট করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
