"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

type JwtPayload = {
  username: string;
  password: string;
  exp: number;
  iat: number;
};

export function TokenMonitor() {
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          // Token expired, show notification and logout
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");

          // Clear token cookie
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("token");

          // Redirect to login
          window.location.href = "/dang-nhap";
          return;
        }

        // Check if token expires in next 5 minutes
        const timeUntilExpiry = decoded.exp - currentTime;
        if (timeUntilExpiry <= 300) {
          // 5 minutes = 300 seconds
          toast.warning(
            `Phiên đăng nhập sẽ hết hạn trong ${Math.ceil(
              timeUntilExpiry / 60
            )} phút`
          );
        }
      } catch (error) {
        console.error("Lỗi xử lý token:", error);
        toast.error("Token không hợp lệ, vui lòng đăng nhập lại");

        // Clear invalid token
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("token");
        window.location.href = "/dang-nhap";
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every 30 seconds
    const interval = setInterval(checkTokenExpiration, 30000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}
