import { useState } from 'react';
import {
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    Code,
    CheckCheck,
    Trash2,
    Settings
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setChatPartner } from '../features/chatSlice';
const NotificationPage = () => {
    const [filter, setFilter] = useState('all'); // all, unread, read
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead: markNotificationAsRead,
        markAllAsRead: markAllNotificationsAsRead,
        deleteNotification: removeNotification
    } = useNotifications();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'read') return notif.isRead;
        return true;
    });


    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
            case 'comment':
                return <MessageCircle className="w-5 h-5 text-blue-500" />;
            case 'follow':
                return <UserPlus className="w-5 h-5 text-green-500" />;
            case 'answer':
                return <Code className="w-5 h-5 text-purple-500" />;
            case 'message':
                return <MessageCircle className="w-5 h-5 text-blue-500 fill-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    // Get notification link
    const getNotificationLink = (notification) => {
        if (notification.type === 'message' && notification.metaData?.conversationId) {
            console.log("its coming here");
            console.log(notification.sender);
            dispatch(setChatPartner(notification.sender));
            return `/chat/${notification.metaData.conversationId}`;
        }
        if (notification.metaData?.postId) return `/feed`;
        if (notification.type === 'follow') return `/profile/${notification.sender._id}`;
        return '/feed';
    };

    const readCount = notifications.filter(n => n.isRead).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Bell className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Notifications
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                                </p>
                            </div>
                        </div>

                        {/* Settings Icon */}
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Filter Tabs and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'unread'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Unread ({unreadCount})
                            </button>
                            <button
                                onClick={() => setFilter('read')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'read'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Read ({readCount})
                            </button>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllNotificationsAsRead}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading notifications...</p>
                    </div>
                )}

                {/* Notifications List */}
                {!loading && (
                    <div className="space-y-3">
                        {filteredNotifications.length === 0 ? (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-800">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No notifications
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {filter === 'unread'
                                        ? "You're all caught up! No unread notifications."
                                        : filter === 'read'
                                            ? "No read notifications yet."
                                            : "You don't have any notifications yet."}
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`group relative bg-white dark:bg-gray-900 rounded-xl p-4 border transition-all hover:shadow-md cursor-pointer ${notification.isRead
                                        ? 'border-gray-100 dark:border-gray-800'
                                        : 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10'
                                        }`}
                                    onClick={() => {
                                        !notification.isRead && markNotificationAsRead(notification._id);
                                        navigate(getNotificationLink(notification));
                                    }}
                                >
                                    <div className="flex gap-4">
                                        {/* User Avatar */}
                                        <Link
                                            to={`/profile/${notification.sender?._id}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img
                                                src={notification.sender?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                                alt={notification.sender?.username}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-colors flex-shrink-0"
                                            />
                                        </Link>

                                        {/* Notification Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div
                                                    className="flex-1"
                                                >
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        <span className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                            {notification.sender?.username || 'Someone'}
                                                        </span>
                                                        {' '}
                                                        <span className="text-gray-600 dark:text-gray-300">
                                                            {notification.message}
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* Notification Type Icon */}
                                                <div className="flex-shrink-0">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatTimestamp(notification.createdAt)}
                                                </span>

                                                {/* Action Buttons (visible on hover) */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markNotificationAsRead(notification._id);
                                                            }}
                                                            className="text-xs px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notification._id);
                                                        }}
                                                        className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                        aria-label="Delete notification"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Thumbnail (Instagram-style) - Only for like and comment notifications */}
                                        {(notification.type === 'like' || notification.type === 'comment') &&
                                            notification.metaData?.post?.images?.[0]?.url && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={notification.metaData.post.images[0].url}
                                                        alt="Post"
                                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-all hover:scale-105"
                                                    />
                                                </div>
                                            )}
                                    </div>

                                    {/* Unread Indicator */}
                                    {!notification.isRead && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Load More Button (for future pagination) */}
                {!loading && filteredNotifications.length > 0 && (
                    <div className="mt-6 text-center">
                        <button className="px-6 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                            Load more notifications
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
