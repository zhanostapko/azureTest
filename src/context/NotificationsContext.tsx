import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import useApi from "../hooks/useApi";
import { AppContext } from "./AppContext";

type Notification = {
  id: number;
  recipientCode: string;
  message: string;
  isNew: boolean;
  created: string;
  updated: string;
  createdByCode: string;
  updatedByCode: string;
};

type NotificationContextType = {
  notifications: Notification[];
  notificationCount: number;
  updateNotificationsList: (showOnlyNew?: boolean) => void;
  markAsReadHandler: (id: number) => void;
  isLoading: boolean;
  setSwitchState: (state: boolean) => void;
  switchState: boolean;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationCount = notifications.filter(
    (notification) => notification.isNew
  ).length;
  const { apiRequest, isLoading } = useApi();
  const { userState, isLoggedIn } = useContext(AppContext);
  const [switchState, setSwitchState] = useState(false);

  const updateNotificationsList = async (showOnlyNew: boolean = false) => {
    try {
      const res = await apiRequest(
        `api/Notifications/GetByCodeList`,
        undefined,
        undefined,
        {
          code: userState?.code,
          pageSize: 100,
          showOnlyNew: switchState,
        }
      );

      const data = res.status === 204 ? [] : (await res.json())[0].value;
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsReadHandler = async (id: number) => {
    const notificationUpdateRes = await apiRequest(
      `api/Notifications/MarkAsRead?notificationId=${id}`,
      "POST"
    );
  };

  useEffect(() => {
    let interval: number;
    if (isLoggedIn && userState?.code) {
      updateNotificationsList();
      interval = window.setInterval(updateNotificationsList, 10000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoggedIn, userState?.code, switchState]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationCount,
        updateNotificationsList,
        markAsReadHandler,
        isLoading,
        switchState,
        setSwitchState,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
