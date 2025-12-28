import { useMemo } from "react";
import { useTelegram } from "../providers/TelegramProvider";

const GreetingHeader = () => {
  const { webApp, isInTelegram } = useTelegram();

  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    }

    if (currentHour < 18) {
      return "Good Afternoon";
    }

    return "Good Evening";
  }, []);

  const username = useMemo(() => {
    if (!isInTelegram || !webApp?.initDataUnsafe.user) {
      return "User";
    }

    const user = webApp.initDataUnsafe.user;
    return user.first_name;
  }, [webApp, isInTelegram]);

  const avatarUrl = useMemo(() => {
    if (!isInTelegram || !webApp?.initDataUnsafe.user?.photo_url) {
      return null;
    }

    return webApp.initDataUnsafe.user.photo_url;
  }, [webApp, isInTelegram]);

  return (
    <div className="greeting-header">
      <div className="greeting-header__content">
        <span className="greeting-header__greeting">{greeting}</span>
        <span className="greeting-header__username">{username}</span>
      </div>
      <div className="greeting-header__avatar">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="greeting-header__avatar-image"
          />
        ) : (
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="20" cy="20" r="20" fill="rgba(255, 255, 255, 0.1)" />
            <circle cx="20" cy="16" r="6" fill="rgba(255, 255, 255, 0.6)" />
            <path
              d="M8 32C8 26 13 22 20 22C27 22 32 26 32 32"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default GreetingHeader;
