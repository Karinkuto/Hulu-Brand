import React from 'react';
import { Bell, Package, CreditCard } from 'lucide-react';

export function Notifications() {
  const dummyNotifications = [
    { id: 1, message: 'Your order has been shipped!', date: '2023-04-15', icon: Package },
    { id: 2, message: 'New product available: Summer Collection', date: '2023-04-14', icon: Bell },
    { id: 3, message: 'Your payment was successful', date: '2023-04-13', icon: CreditCard },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      {dummyNotifications.length === 0 ? (
        <p className="text-muted-foreground">You have no notifications.</p>
      ) : (
        <ul className="space-y-4">
          {dummyNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <li key={notification.id} className="border-b pb-4">
                <div className="flex items-start space-x-3">
                  <div className="border rounded-full p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-muted-foreground">{notification.date}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}