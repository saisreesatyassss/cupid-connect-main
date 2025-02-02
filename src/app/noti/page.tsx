"use client"

import React, { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { firebaseApp } from "../../lib/firebaseConfig";

const VAPID_KEY = "BPRttqabA2LNhleGgOs-dgNeYS6GRNATr74cjFI7CgV048lh9ZlLMDDa0ZPRi666QQFf6GYOSioP8It-K5dCn_4";

interface NotificationData {
  title: string;
  body: string;
}

interface FirebaseNotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
}

const NotificationPage: React.FC = () => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [messaging, setMessaging] = useState<Messaging | null>(null);

  useEffect(() => {
    if (!('Notification' in window)) {
      setError('This browser does not support notifications');
      return;
    }
    setPermissionStatus(Notification.permission);
    
    // Initialize messaging once
    const msg = getMessaging(firebaseApp);
    setMessaging(msg);
  }, []);
useEffect(() => {
  const registerServiceWorker = async () => {
    try {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("Service Worker registered successfully.");
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      setError("Failed to register service worker.");
    }
  };

  registerServiceWorker();
}, []);

  const initializeFirebaseMessaging = async (): Promise<void> => {
    try {
      if (!messaging) {
        throw new Error('Messaging not initialized');
      }

      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        setFcmToken(token);

        onMessage(messaging, (payload: FirebaseNotificationPayload) => {
          setNotification({
            title: payload.notification?.title || 'New Message',
            body: payload.notification?.body || 'You have a new notification'
          });
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError('Error initializing notifications: ' + errorMessage);
    }
  };

  const sendTestNotification = (): void => {
    setNotification({
      title: 'Test Notification',
      body: 'This is a test notification to verify the display!'
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Push Notifications Demo</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Notification Status</h2>
            <p className="mb-2">Permission: <span className="font-medium">{permissionStatus}</span></p>
            
            {fcmToken && (
              <div className="mt-4">
                <p className="font-medium">FCM Token:</p>
                <div className="bg-gray-100 p-2 rounded mt-1 break-all">
                  <code className="text-sm">{fcmToken}</code>
                </div>
              </div>
            )}
          </div>

          {permissionStatus !== 'granted' && (
            <button
              onClick={initializeFirebaseMessaging}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Enable Push Notifications
            </button>
          )}

          {permissionStatus === 'granted' && (
            <button
              onClick={sendTestNotification}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
            >
              Send Test Notification
            </button>
          )}

          {notification && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
              <h3 className="font-bold text-lg mb-2">{notification.title}</h3>
              <p>{notification.body}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;