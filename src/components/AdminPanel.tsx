import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { LogIn, LogOut, Plus, Trash2, Image as ImageIcon, Layout, Send, User, MapPin, Users, Film, MessageSquare, Save, Phone, Mail, Link as LinkIcon, Upload, Edit, XCircle, Clock, X, ShieldCheck, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SAMILogo } from './SAMILogo';

const categories = ['জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'অর্থনীতি', 'বাণিজ্য', 'সারা দেশ', 'সরিষাবাড়ী', 'খেলাধুলা', 'বিনোদন', 'তথ্যপ্রযুক্তি', 'জামালপুর'];
const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

const categoryMap: Record<string, string> = {
  'National': 'জাতীয়',
  'Politics': 'রাজনীতি',
  'International': 'আন্তর্জাতিক',
  'World': 'বিশ্ব',
  'Business': 'বাণিজ্য',
  'Economy': 'অর্থনীতি',
  'Economic': 'অর্থনীতি',
  'Around the Country': 'সারা দেশ',
  'Sarishabari': 'সরিষাবাড়ী',
  'Sports': 'খেলাধুলা',
  'Entertainment': 'বিনোদন',
  'IT': 'তথ্যপ্রযুক্তি',
  'Jamalpur': 'জামালপুর'
};

const divisionMap: Record<string, string> = {
  'Dhaka': 'ঢাকা',
  'Chattogram': 'চট্টগ্রাম',
  'Rajshahi': 'রাজশাহী',
  'Khulna': 'খুলনা',
  'Barishal': 'বরিশাল',
  'Sylhet': 'সিলেট',
  'Rangpur': 'রংপুর',
  'Mymensingh': 'ময়মনসিংহ'
};

type AdminTab = 'dashboard' | 'news' | 'reporters' | 'media' | 'ticker' | 'ads' | 'schedule' | 'applications' | 'messages' | 'migration';

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
  const [isLocalAdmin, setIsLocalAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

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

  // Schedule State
  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const [scheduleForm, setScheduleForm] = useState({
    time: '',
    title: '',
    active: false,
    order: 0
  });

  // Applications & Messages State
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStats, setMigrationStats] = useState({ total: 0, completed: 0, currentItem: '' });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
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
      showNotification("নিউজ লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে ইনডেক্স চেক করুন।", "error");
    });

    // Reporters Subscription
    const qReporters = query(collection(db, 'reporters'), orderBy('name', 'asc'));
    const unsubscribeReporters = onSnapshot(qReporters, (snapshot) => {
      setReporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Reporters Subscription Error: ", error);
      showNotification("রিপোর্টারদের তথ্য লোড করতে সমস্যা হচ্ছে।", "error");
    });

    // Media Subscription
    const qMedia = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribeMedia = onSnapshot(qMedia, (snapshot) => {
      setMediaList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Media Subscription Error: ", error);
      showNotification("মিডিয়া লোড করতে সমস্যা হচ্ছে।", "error");
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
      showNotification("বিজ্ঞাপন লোড করতে সমস্যা হচ্ছে।", "error");
    });

    // Schedule Subscription
    const qSchedule = query(collection(db, 'schedules'), orderBy('order', 'asc'));
    const unsubscribeSchedule = onSnapshot(qSchedule, (snapshot) => {
      setScheduleList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Schedule Subscription Error: ", error);
      showNotification("অনুষ্ঠান সূচী লোড করতে সমস্যা হচ্ছে।", "error");
    });

    // Protected Subscriptions (Only if authenticated as Admin)
    const isAdminUser = user?.email === "info.samitv.bd@gmail.com";
    
    let unsubscribeApps: (() => void) | undefined;
    let unsubscribeMessages: (() => void) | undefined;

    if (isAdminUser || isLocalAdmin) {
      // Applications Subscription
      const qApps = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      unsubscribeApps = onSnapshot(qApps, (snapshot) => {
        setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        // If it's a permission error, we don't spam the console if we're not technically Firebase Admin
        if (!error.message.includes('insufficient permissions')) {
          console.error("Applications Subscription Error: ", error);
        }
      });

      // Messages Subscription
      const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        if (!error.message.includes('insufficient permissions')) {
          console.error("Messages Subscription Error: ", error);
        }
      });
    }

    return () => {
      unsubscribeAuth();
      unsubscribeNews();
      unsubscribeReporters();
      unsubscribeMedia();
      unsubscribeTicker();
      unsubscribeAds();
      unsubscribeSchedule();
      if (unsubscribeApps) unsubscribeApps();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [user, isLocalAdmin]);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput.username === 'samitv' && loginInput.password === 'samitv') {
      setIsLocalAdmin(true);
      setLoginError('');
      // Persist session for current tab
      sessionStorage.setItem('sami_admin_auth', 'true');
    } else {
      setLoginError('ইউজারনেম বা পাসওয়ার্ড সঠিক নয়!');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showNotification('গুগল দিয়ে সফলভাবে লগইন হয়েছে!', 'success');
    } catch (error) {
      console.error("Login Error: ", error);
      showNotification('গুগল লগইন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLocalAdmin(false);
    sessionStorage.removeItem('sami_admin_auth');
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('sami_admin_auth');
    if (savedAuth === 'true') {
      setIsLocalAdmin(true);
    }
  }, []);

  const uploadFile = async (file: File, path: string) => {
    return new Promise<string>((resolve, reject) => {
      const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error("Upload Error: ", error);
          reject(error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadProgress(0);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageUrl = newsForm.imageUrl;
      if (newsUploadMode === 'file' && newsImageFile) {
        finalImageUrl = await uploadFile(newsImageFile, 'news');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি নির্বাচন করুন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), {
          ...newsForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('নিউজ সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'news'), {
          ...newsForm,
          imageUrl: finalImageUrl,
          authorUid: user.uid,
          createdAt: serverTimestamp()
        });
        showNotification('নিউজ সফলভাবে আপলোড করা হয়েছে!');
      }
      setNewsForm({ title: '', content: '', imageUrl: '', category: 'জাতীয়', journalistName: '', location: '' });
      setNewsImageFile(null);
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'news');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReporterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageUrl = reporterForm.imageUrl;
      if (reporterUploadMode === 'file' && reporterImageFile) {
        finalImageUrl = await uploadFile(reporterImageFile, 'reporters');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি নির্বাচন করুন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'reporters', editingId), {
          ...reporterForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('রিপোর্টারের তথ্য সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'reporters'), {
          ...reporterForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('নতুন রিপোর্টার সফলভাবে যুক্ত করা হয়েছে!');
      }
      setReporterForm({ name: '', designation: '', imageUrl: '', location: '', division: 'ঢাকা', phone: '', email: '' });
      setReporterImageFile(null);
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'reporters');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageUrl = mediaForm.imageUrl;
      if (mediaUploadMode === 'file' && mediaImageFile) {
        finalImageUrl = await uploadFile(mediaImageFile, 'media');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি নির্বাচন করুন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'media', editingId), {
          ...mediaForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('মিডিয়া সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'media'), {
          ...mediaForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('মিডিয়া সফলভাবে আপলোড করা হয়েছে!');
      }
      setMediaForm({ title: '', imageUrl: '', type: 'image', videoUrl: '' });
      setMediaImageFile(null);
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'media');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
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
      showNotification('নিউজ টিকার আপডেট করা হয়েছে!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/ticker');
      showNotification('নিউজ টিকার আপডেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsUpdatingTicker(false);
    }
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageUrl = adForm.imageUrl;
      if (adUploadMode === 'file' && adImageFile) {
        finalImageUrl = await uploadFile(adImageFile, 'ads');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি নির্বাচন করুন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'ads', editingId), {
          ...adForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('বিজ্ঞাপন আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'ads'), {
          ...adForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('বিজ্ঞাপন পাবলিশ করা হয়েছে!');
      }
      setAdForm({ title: '', imageUrl: '', link: '', position: 'sidebar', active: true });
      setAdImageFile(null);
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'ads');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'schedules', editingId), {
          ...scheduleForm,
          updatedAt: serverTimestamp()
        });
        showNotification('প্রোগ্রাম আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'schedules'), {
          ...scheduleForm,
          createdAt: serverTimestamp()
        });
        showNotification('প্রোগ্রাম সূচীতে যুক্ত করা হয়েছে!');
      }
      setScheduleForm({ time: '', title: '', active: false, order: scheduleList.length });
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'schedules');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
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
        category: categoryMap[item.category] || item.category,
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
        division: divisionMap[item.division] || item.division,
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
    } else if (type === 'schedule') {
      setScheduleForm({
        time: item.time,
        title: item.title,
        active: item.active,
        order: item.order || 0
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewsForm({ title: '', content: '', imageUrl: '', category: 'জাতীয়', journalistName: '', location: '' });
    setReporterForm({ name: '', designation: '', imageUrl: '', location: '', division: 'ঢাকা', phone: '', email: '' });
    setMediaForm({ title: '', imageUrl: '', type: 'image', videoUrl: '' });
    setAdForm({ title: '', imageUrl: '', link: '', position: 'sidebar', active: true });
    setScheduleForm({ time: '', title: '', active: false, order: 0 });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, confirmDelete.collection, confirmDelete.id));
      showNotification('সফলভাবে ডিলিট করা হয়েছে!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${confirmDelete.collection}/${confirmDelete.id}`);
      showNotification('ডিলিট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const migrateImagesToStorage = async () => {
    if (!user) {
      showNotification('ডাটা ট্রান্সফার ইউটিলিটি ব্যবহার করতে অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    if (!confirm('আপনি কি নিশ্চিত যে আপনি সব ছবি ফায়ারবেস স্টোরেজে স্থানান্তর করতে চান? এই প্রক্রিয়াটি কিছুক্ষণ সময় নিতে পারে।')) return;
    
    setIsMigrating(true);
    const totalItems = newsList.length + reporters.length + mediaList.length + adsList.length;
    let completedCount = 0;
    
    setMigrationStats({ total: totalItems, completed: 0, currentItem: 'Starting...' });

    const migrateCollection = async (list: any[], collectionName: string) => {
      for (const item of list) {
        setMigrationStats(prev => ({ ...prev, currentItem: `${collectionName}: ${item.title || item.name || item.id}` }));
        
        const imageUrl = item.imageUrl;
        // Check if it's already in storage
        if (imageUrl && !imageUrl.includes('firebasestorage.googleapis.com')) {
          try {
            // Fetch image
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Fetch failed');
            const blob = await response.blob();
            const file = new File([blob], `migrated_${Date.now()}.jpg`, { type: blob.type });
            
            // Upload to storage
            const storagePath = collectionName === 'news' ? 'news' : collectionName === 'reporters' ? 'reporters' : collectionName === 'media' ? 'media' : 'ads';
            const newUrl = await uploadFile(file, storagePath);
            
            // Update firestore
            await updateDoc(doc(db, collectionName, item.id), {
              imageUrl: newUrl,
              migratedAt: serverTimestamp()
            });
          } catch (error) {
            console.error(`Migration error for ${item.id}: `, error);
          }
        }
        completedCount++;
        setMigrationStats(prev => ({ ...prev, completed: completedCount }));
      }
    };

    try {
      await migrateCollection(newsList, 'news');
      await migrateCollection(reporters, 'reporters');
      await migrateCollection(mediaList, 'media');
      await migrateCollection(adsList, 'ads');
      showNotification('সব ছবি সফলভাবে স্থানান্তর করা হয়েছে!');
    } catch (error) {
      console.error("Migration failed: ", error);
      showNotification('ডাটা স্থানান্তরের সময় ত্রুটি ঘটেছে। কিছু ছবির ক্ষেত্রে ওরিজিনাল সাইটের সিকিউরিটি বা CORS ইস্যু থাকতে পারে।', 'error');
    } finally {
      setIsMigrating(false);
      setMigrationStats({ total: 0, completed: 0, currentItem: '' });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen font-eng">অ্যাডমিন প্যানেল লোড হচ্ছে...</div>;

  if (!isLocalAdmin && (!user || user.email !== 'info.samitv.bd@gmail.com')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sami-dark to-sami-teal p-4 relative overflow-hidden font-eng">
        {/* Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-sami-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sami-red/5 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full text-center relative z-10 border border-white/20"
        >
          <div className="mb-8">
            <SAMILogo className="scale-125 mb-4" />
            <div className="h-1 w-20 bg-sami-red mx-auto rounded-full mt-4"></div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sami-red/10 text-sami-red rounded-full text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} />
              নিরাপদ অ্যাডমিন অ্যাক্সেস
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">অ্যাডমিন লগইন</h1>
            
            <form onSubmit={handleCustomLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">ইউজারনেম</label>
                <input 
                  type="text" 
                  required
                  value={loginInput.username}
                  onChange={(e) => setLoginInput({...loginInput, username: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-sami-red transition-all font-bold"
                  placeholder="ইউজারনেম"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">পাসওয়ার্ড</label>
                <input 
                  type="password" 
                  required
                  value={loginInput.password}
                  onChange={(e) => setLoginInput({...loginInput, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-sami-red transition-all font-bold"
                  placeholder="পাসওয়ার্ড"
                />
              </div>
              
              {loginError && (
                <p className="text-red-500 text-xs font-bold text-center animate-shake">{loginError}</p>
              )}

              <button 
                type="submit"
                className="w-full bg-sami-red text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-sami-dark transition-all shadow-lg shadow-sami-red/20 hover:shadow-xl active:scale-[0.98]"
              >
                <LogIn size={20} />
                লগইন করুন
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-bold tracking-widest text-[9px]">অথবা ক্লাউড সেভ অ্যাক্সেস</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                গুগল দিয়ে লগইন করুন
              </button>
            </form>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 space-y-2 font-eng">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} সামি মাল্টিমিডিয়া লিমিটেড
            </p>
            <p className="text-[11px] text-sami-red font-black uppercase tracking-tighter">
              ডেভেলপড বাই এমরান হাসান সামি
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col sticky top-0 md:h-screen z-50">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sami-red rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-sami-red/20 ring-2 ring-white/10">S</div>
            <div className="font-eng">
              <h1 className="font-black text-sm uppercase tracking-tighter">SAMI CMS</h1>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Admin v2.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 font-eng">
          {[
            { id: 'dashboard', icon: Layout, label: 'ড্যাশবোর্ড' },
            { id: 'news', icon: Send, label: 'নিউজ ম্যানেজমেন্ট' },
            { id: 'reporters', icon: Users, label: 'আমাদের পরিবার' },
            { id: 'media', icon: Film, label: 'মিডিয়া গ্যালারি' },
            { id: 'ticker', icon: MessageSquare, label: 'নিউজ টিকার' },
            { id: 'schedule', icon: Calendar, label: 'অনুষ্ঠান সূচী' },
            { id: 'ads', icon: ImageIcon, label: 'বিজ্ঞাপন ম্যানেজমেন্ট' },
            { id: 'applications', icon: Users, label: 'চাকরির আবেদন' },
            { id: 'messages', icon: MessageSquare, label: 'মেসেজ বক্স' },
            { id: 'migration', icon: Upload, label: 'ডাটা ট্রান্সফার' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-sami-red text-white shadow-lg shadow-sami-red/20 scale-[1.02]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-gray-500'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
             <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                <User size={16} className="text-gray-400" />
             </div>
             <div className="flex-1 min-w-0 font-eng">
                <p className="text-[11px] font-bold truncate uppercase">{user?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-[9px] text-gray-500 font-black uppercase">রোল: সুপার অ্যাডমিন</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/10 text-red-500 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition-all border border-red-600/20"
          >
            <LogOut size={16} /> লগআউট করুন
          </button>
          
          <div className="text-center pt-2 font-eng">
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">ডেভেলপমেন্ট বাই</p>
            <p className="text-[10px] text-sami-red font-black uppercase tracking-tighter">এমরান হাসান সামি</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 font-eng">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">
               {activeTab === 'dashboard' && 'অ্যাডমিন ড্যাশবোর্ড'}
               {activeTab === 'news' && 'নিউজ ম্যানেজমেন্ট'}
               {activeTab === 'reporters' && 'রিপোর্টার প্যানেল'}
               {activeTab === 'media' && 'মিডিয়া গ্যালারি'}
               {activeTab === 'ticker' && 'টিকার নিউজ এডিটর'}
               {activeTab === 'schedule' && 'অনুষ্ঠান সূচী'}
               {activeTab === 'ads' && 'অ্যাড ম্যানেজমেন্ট'}
               {activeTab === 'applications' && 'চাকরির আবেদন'}
               {activeTab === 'messages' && 'ইউজার মেসেজ'}
               {activeTab === 'migration' && 'সিস্টেম মাইগ্রেশন'}
             </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">জামালপুর টিভি</p>
             </div>
             <div className="w-px h-8 bg-gray-100"></div>
             <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                <ShieldCheck size={20} className="text-green-600" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">

        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-eng">
              {[
                { label: 'মোট নিউজ', value: stats.news, icon: Layout, color: 'blue', bg: 'bg-blue-500' },
                { label: 'রিপোর্টার', value: stats.reporters, icon: Users, color: 'green', bg: 'bg-emerald-500' },
                { label: 'মিডিয়া ফাইল', value: stats.media, icon: Film, color: 'purple', bg: 'bg-violet-500' },
                { label: 'বিজ্ঞাপন', value: stats.ads, icon: ImageIcon, color: 'red', bg: 'bg-sami-red' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
                  <div className={`w-14 h-14 ${stat.bg} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={28} />
                  </div>
                  <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 font-eng">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tight font-eng">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Send size={20} className="text-sami-red" /> সাম্প্রতিক নিউজ
                </h3>
                <div className="space-y-4">
                  {newsList.slice(0, 5).map(news => (
                    <div key={news.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all font-eng">
                      <img src={news.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-sm">{news.title}</p>
                        <p className="text-[10px] text-gray-500">{news.createdAt?.toDate()?.toLocaleDateString('en-US')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('news')} className="w-full mt-6 py-2 text-sami-red font-bold text-sm hover:underline">সব নিউজ দেখুন</button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Users size={20} className="text-sami-red" /> নতুন রিপোর্টার
                </h3>
                <div className="space-y-4">
                  {reporters.slice(0, 5).map(rep => (
                    <div key={rep.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all font-eng">
                      <img src={rep.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{rep.name}</p>
                        <p className="text-[10px] text-sami-red">{rep.designation}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('reporters')} className="w-full mt-6 py-2 text-sami-red font-bold text-sm hover:underline">সব রিপোর্টার দেখুন</button>
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
                  <div className="flex items-center justify-between mb-6 font-eng">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-red" />}
                      {editingId ? 'নিউজ আপডেট করুন' : 'নতুন নিউজ'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleNewsSubmit} className="space-y-4 font-eng">
                    <input type="text" required value={newsForm.title} onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="নিউজের শিরোনাম" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" required value={newsForm.journalistName} onChange={(e) => setNewsForm({...newsForm, journalistName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="সাংবাদিকের নাম" />
                      <input type="text" required value={newsForm.location} onChange={(e) => setNewsForm({...newsForm, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="স্থান" />
                    </div>
                    <select value={newsForm.category} onChange={(e) => setNewsForm({...newsForm, category: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setNewsUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${newsUploadMode === 'url' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-500'}`}>ইউআরএল (URL)</button>
                        <button type="button" onClick={() => setNewsUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${newsUploadMode === 'file' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-500'}`}>আপলোড (Upload)</button>
                      </div>
                      {newsUploadMode === 'url' ? (
                        <input type="url" required value={newsForm.imageUrl} onChange={(e) => setNewsForm({...newsForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ছবির ইউআরএল" />
                      ) : (
                        <input type="file" required accept="image/*" onChange={(e) => setNewsImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                      )}
                    </div>

                    <textarea required rows={6} value={newsForm.content} onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none resize-none" placeholder="নিউজের বিস্তারিত তথ্য..." />
                    
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-sami-red"
                        />
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? 'প্রসেসিং...' : (editingId ? 'নিউজ আপডেট করুন' : 'নিউজ পাবলিশ করুন')}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'reporters' && (
                <>
                  <div className="flex items-center justify-between mb-6 font-eng">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-red" />}
                      {editingId ? 'রিপোর্টার আপডেট করুন' : 'নতুন রিপোর্টার'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleReporterSubmit} className="space-y-4 font-eng">
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
                        <button type="button" onClick={() => setReporterUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${reporterUploadMode === 'url' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-500'}`}>ইউআরএল (URL)</button>
                        <button type="button" onClick={() => setReporterUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${reporterUploadMode === 'file' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-500'}`}>আপলোড (Upload)</button>
                      </div>
                      {reporterUploadMode === 'url' ? (
                        <input type="url" required value={reporterForm.imageUrl} onChange={(e) => setReporterForm({...reporterForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ছবির ইউআরএল" />
                      ) : (
                        <input type="file" required accept="image/*" onChange={(e) => setReporterImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                      )}
                    </div>

                    <input type="text" value={reporterForm.phone} onChange={(e) => setReporterForm({...reporterForm, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none font-eng" placeholder="ফোন নম্বর (ঐচ্ছিক)" />
                    <input type="email" value={reporterForm.email} onChange={(e) => setReporterForm({...reporterForm, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none font-eng" placeholder="ইমেইল (ঐচ্ছিক)" />
                    
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-sami-red"
                        />
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? 'প্রসেসিং...' : (editingId ? 'রিপোর্টার আপডেট করুন' : 'রিপোর্টার যুক্ত করুন')}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'media' && (
                <>
                  <div className="flex items-center justify-between mb-1 font-eng">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-red" />}
                      {editingId ? 'মিডিয়া আপডেট করুন' : 'নতুন মিডিয়া'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mb-6 font-eng font-bold uppercase tracking-widest">আপলোড করা ছবি এবং ভিডিও সরাসরি "মিডিয়া" পেজে দেখা যাবে।</p>
                  <form onSubmit={handleMediaSubmit} className="space-y-4 font-eng">
                    <input type="text" required value={mediaForm.title} onChange={(e) => setMediaForm({...mediaForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="শিরোনাম" />
                    <select value={mediaForm.type} onChange={(e) => setMediaForm({...mediaForm, type: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                      <option value="image">ছবি (Image)</option>
                      <option value="video">ভিডিও (Video)</option>
                    </select>
                    
                    <div className="space-y-2">
                       <div className="flex gap-2">
                         <button type="button" onClick={() => setMediaUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${mediaUploadMode === 'url' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-500'}`}>ইউআরএল (URL)</button>
                         <button type="button" onClick={() => setMediaUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${mediaUploadMode === 'file' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-500'}`}>আপলোড (Upload)</button>
                       </div>
                       {mediaUploadMode === 'url' ? (
                         <input type="url" required value={mediaForm.imageUrl} onChange={(e) => setMediaForm({...mediaForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="থাম্বনেইল ছবির ইউআরএল" />
                       ) : (
                         <input type="file" required accept="image/*" onChange={(e) => setMediaImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                       )}
                    </div>

                    {mediaForm.type === 'video' && (
                      <input type="url" required value={mediaForm.videoUrl} onChange={(e) => setMediaForm({...mediaForm, videoUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none font-eng" placeholder="ভিডিও ইউআরএল (ইউটিউব/সরাসরি লিঙ্ক)" />
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? 'প্রসেসিং...' : (editingId ? 'মিডিয়া আপডেট করুন' : 'মিডিয়া আপলোড করুন')}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'ticker' && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-eng font-bold"><MessageSquare size={20} className="text-sami-red" /> এডিট নিউজ টিকার</h2>
                  <div className="space-y-4 font-eng">
                    <textarea rows={4} value={tickerText} onChange={(e) => setTickerText(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none resize-none" placeholder="ব্র্রেকিং নিউজের টেক্সট লিখুন..." />
                    <button onClick={handleTickerUpdate} disabled={isUpdatingTicker} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Save size={18} /> {isUpdatingTicker ? 'আপডেট হচ্ছে...' : 'টিকার আপডেট করুন'}
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'ads' && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-eng"><Plus size={20} className="text-sami-red" /> নতুন বিজ্ঞাপন</h2>
                  <form onSubmit={handleAdSubmit} className="space-y-4 font-eng">
                    <input type="text" required value={adForm.title} onChange={(e) => setAdForm({...adForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="বিজ্ঞাপনের শিরোনাম" />
                    <input type="url" value={adForm.link} onChange={(e) => setAdForm({...adForm, link: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="লিঙ্ক (ঐচ্ছিক)" />
                    
                    <select value={adForm.position} onChange={(e) => setAdForm({...adForm, position: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                      <option value="sidebar">সাইডবার (Sidebar)</option>
                      <option value="content">নিউজের ভিতরে (Content)</option>
                      <option value="popup">পপআপ (Popup)</option>
                    </select>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setAdUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${adUploadMode === 'url' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-500'}`}>ইউআরএল (URL)</button>
                        <button type="button" onClick={() => setAdUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${adUploadMode === 'file' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-500'}`}>আপলোড (Upload)</button>
                      </div>
                      {adUploadMode === 'url' ? (
                        <input type="url" required value={adForm.imageUrl} onChange={(e) => setAdForm({...adForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ব্যানার ছবির ইউআরএল" />
                      ) : (
                        <input type="file" required accept="image/*" onChange={(e) => setAdImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                      )}
                    </div>

                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-sami-red"
                        />
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? (uploadProgress > 0 ? `আপলোড হচ্ছে ${Math.round(uploadProgress)}%` : 'প্রসেসিং...') : (editingId ? 'বিজ্ঞাপন আপডেট করুন' : 'বিজ্ঞাপন পাবলিশ করুন')}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'schedule' && (
                <>
                  <div className="flex items-center justify-between mb-6 font-eng">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-red" />}
                      {editingId ? 'প্রোগ্রাম আপডেট করুন' : 'নতুন প্রোগ্রাম'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleScheduleSubmit} className="space-y-4 font-eng">
                    <input type="text" required value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none font-eng" placeholder="সময় (যেমন: ০৯:০০ সকাল)" />
                    <input type="text" required value={scheduleForm.title} onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="প্রোগ্রামের শিরোনাম" />
                    <input type="number" required value={scheduleForm.order} onChange={(e) => setScheduleForm({...scheduleForm, order: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ক্রমিক নম্বর (Sort Order)" />
                    
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input type="checkbox" checked={scheduleForm.active} onChange={(e) => setScheduleForm({...scheduleForm, active: e.target.checked})} className="w-5 h-5 accent-sami-red" />
                      <span className="font-bold text-gray-700">এখন চলছে? (LIVE NOW)</span>
                    </label>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Save size={18} /> {isSubmitting ? 'প্রসেসিং...' : (editingId ? 'প্রোগ্রাম আপডেট করুন' : 'সূচীতে যুক্ত করুন')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Lists */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[600px] font-eng">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Layout size={20} className="text-sami-red" /> 
                  <span className="uppercase tracking-tight text-gray-900">
                    {activeTab === 'news' && 'আপলোড করা নিউজ লিস্ট'}
                    {activeTab === 'reporters' && 'রিপোর্টার লিস্ট'}
                    {activeTab === 'media' && 'মিডিয়া গ্যালারি'}
                    {activeTab === 'ticker' && 'বর্তমান ব্রেকিং নিউজ'}
                    {activeTab === 'schedule' && 'লাইভ অনুষ্ঠান সূচী'}
                    {activeTab === 'ads' && 'বিজ্ঞাপন স্লট'}
                    {activeTab === 'applications' && 'চাকরির আবেদন সমূহ'}
                    {activeTab === 'messages' && 'ইউজার মেসেজ বক্স'}
                  </span>
                </h2>

              <div className="space-y-4">
                {activeTab === 'news' && newsList.map((news) => (
                  <div key={news.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                    <img src={news.imageUrl} alt="" className="w-24 h-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] bg-sami-red/10 text-sami-red px-2 py-0.5 rounded-full font-bold uppercase">{categoryMap[news.category] || news.category}</span>
                      <h3 className="font-bold text-gray-900 line-clamp-1 mt-1">{news.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{news.content}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 font-eng">
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
                      <p className="text-xs text-gray-500">{reporter.location} | {divisionMap[reporter.division] || reporter.division}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 font-eng">
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
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider font-eng">{media.type === 'image' ? 'ছবি' : 'ভিডিও'}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 font-eng">
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
                    <p className="text-sami-dark font-medium italic">"{tickerText || 'কোন ব্রেকিং নিউজ নেই'}"</p>
                  </div>
                )}

                    {activeTab === 'ads' && adsList.map((ad) => (
                      <div key={ad.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                        <img src={ad.imageUrl} alt="" className="w-24 h-20 shrink-0 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-sami-blue/10 text-sami-blue px-2 py-0.5 rounded-full font-bold uppercase">{ad.position}</span>
                            {ad.active ? (
                              <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">সক্রিয়</span>
                            ) : (
                              <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">নিষ্ক্রিয়</span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 line-clamp-1 mt-1">{ad.title}</h3>
                          <p className="text-xs text-gray-500 truncate font-eng">{ad.link || 'কোন লিঙ্ক নেই'}</p>
                        </div>
                        <button 
                          onClick={() => setConfirmDelete({ collection: 'ads', id: ad.id })} 
                          className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs shrink-0 font-eng"
                        >
                          <Trash2 size={16} />
                          <span>ডিলিট</span>
                        </button>
                      </div>
                    ))}

                    {activeTab === 'schedule' && scheduleList.map((prog) => (
                      <div key={prog.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group items-center">
                        <div className="w-16 text-xs font-black text-gray-400 font-eng">
                          {prog.time}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 font-eng">
                            <h3 className="font-bold text-gray-900">{prog.title}</h3>
                            {prog.active && <span className="text-[9px] bg-red-100 text-sami-red px-2 py-0.5 rounded-full font-black uppercase tracking-widest line-none h-fit">এখন চলছে</span>}
                          </div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 font-eng">ক্রমিক নম্বর: {prog.order}</p>
                        </div>
                        <div className="flex gap-2 font-eng">
                          <button 
                            onClick={() => startEditing(prog, 'schedule')} 
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                            title="এডিট"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ collection: 'schedules', id: prog.id })} 
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="ডিলিট"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                {activeTab === 'applications' && applications.map((app) => (
                  <div key={app.id} className="p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img src={app.imageUrl} alt="" className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{app.name}</h3>
                          <span className="text-[10px] bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider font-eng">অপেক্ষমাণ</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600 mb-4">
                          <p className="flex items-center gap-2"><Phone size={14} className="text-sami-blue" /> {app.phone}</p>
                          <p className="flex items-center gap-2"><Mail size={14} className="text-sami-blue" /> {app.email || 'প্রযোজ্য নয়'}</p>
                          <p className="flex items-center gap-2"><MapPin size={14} className="text-sami-blue" /> {app.location} ({divisionMap[app.division] || app.division})</p>
                          <p className="flex items-center gap-2"><Clock size={14} className="text-sami-blue" /> {app.createdAt?.toDate()?.toLocaleString('en-US')}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-700 italic font-eng">
                          <p className="font-bold text-gray-900 not-italic mb-1">পূর্ব অভিজ্ঞতা:</p>
                          {app.experience || 'কোন অভিজ্ঞতার কথা উল্লেখ নেই।'}
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2 font-eng">
                        <button 
                          onClick={() => setConfirmDelete({ collection: 'applications', id: app.id })}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={16} /> ডিলিট করুন
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
                          <p className="text-xs text-gray-500">{msg.createdAt?.toDate()?.toLocaleString('en-US')}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">{msg.subject}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <p className="flex items-center gap-2"><Phone size={14} className="text-sami-blue" /> {msg.phone}</p>
                      <p className="flex items-center gap-2"><Mail size={14} className="text-sami-blue" /> {msg.email || 'প্রযোজ্য নয়'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed font-eng">
                      {msg.message}
                    </div>
                    <div className="mt-4 flex justify-end font-eng">
                      <button 
                        onClick={() => setConfirmDelete({ collection: 'messages', id: msg.id })}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs uppercase tracking-widest"
                      >
                        <Trash2 size={16} /> ডিলিট করুন
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'migration' && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center font-eng">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">ডাটা ট্রান্সফার ইউটিলিটি</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed font-bold uppercase tracking-widest text-[11px]">
                      নিউজ, রিপোর্টার এবং মিডিয়ার জন্য আগে আপলোড করা ছবিগুলো সরাসরি ফায়ারবেস স্টোরেজে স্থানান্তর করতে এই টুলটি ব্যবহার করুন। এটি আপনার ওয়েবসাইট লোড দ্রুত করতে সাহায্য করবে।
                    </p>

                    {isMigrating ? (
                      <div className="space-y-6">
                        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-sami-red h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(migrationStats.completed / migrationStats.total) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                          <span>প্রসেসিং: {migrationStats.completed} / {migrationStats.total}</span>
                          <span>{Math.round((migrationStats.completed / migrationStats.total) * 100)}%</span>
                        </div>
                        <p className="text-xs text-gray-400 italic truncate">
                          {migrationStats.currentItem}
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={migrateImagesToStorage}
                        className="bg-sami-red text-white px-10 py-4 rounded-2xl font-bold hover:bg-sami-dark transition-all shadow-lg shadow-sami-red/20 uppercase tracking-widest"
                      >
                        স্থানান্তর শুরু করুন
                      </button>
                    )}

                    <div className="mt-12 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-left">
                      <p className="text-xs text-yellow-700 font-bold flex items-center gap-2 font-eng uppercase tracking-widest">
                        <ShieldCheck size={14} /> নোট:
                      </p>
                      <p className="text-[10px] text-yellow-600 mt-1 font-eng font-bold uppercase tracking-widest">
                        কিছু ছবি (যেমন ব্লগার বা অন্য সাইট থেকে আনা) নিরাপত্তা নীতির কারণে স্থানান্তর নাও হতে পারে। সেক্ষেত্রে অনুগ্রহ করে সেই নিউজ আইটেমগুলো এডিট করে ম্যানুয়ালি ছবি আপলোড করুন।
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>

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
              <h3 className="text-xl font-bold mb-2 font-eng uppercase tracking-tight">আপনি কি নিশ্চিত?</h3>
              <p className="text-gray-500 mb-8 font-eng font-bold uppercase tracking-widest text-xs">এই আইটেমটি স্থায়ীভাবে ডিলিট হয়ে যাবে এবং আর ফিরে পাওয়া যাবে না।</p>
              <div className="flex gap-4 font-eng">
                <button 
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all uppercase tracking-widest text-[10px]"
                >
                  না, ফিরে যান
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-[10px]"
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
