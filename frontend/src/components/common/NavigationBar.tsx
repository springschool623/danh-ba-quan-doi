"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useState } from "react";
import { useEffect } from "react";
import { getWards } from "@/services/ward.service";
import { Ward } from "@/types/wards";
import { userLogout } from "@/services/login.service";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import {
  getUserPermissionByRole,
  getUserRoles,
  updateUser,
} from "@/services/user.service";
import { toast } from "sonner";
import { Role } from "@/types/roles";
import usePermission, { useWardPermission } from "@/hooks/usePermission";
import { User } from "@/types/users";
export function NavigationBar() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const user = useUser();
  const permissions = usePermission(user as User);
  const ward = useWardPermission(user as User);

  useEffect(() => {
    if (isAccountOpen && accountPassword === "") {
      setAccountPassword(user?.btlhcm_nd_matkhau ?? "");
      setShowPassword(false);
    }
  }, [isAccountOpen, accountPassword, user]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) return;
      const userRoles = await getUserRoles(user);
      setUserRoles(userRoles);
    };
    fetchUserRoles();
  }, [user, userRoles]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const wards = await getWards();
        setWards(wards);
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, []);

  const handleChangePassword = async () => {
    if (!user?.btlhcm_nd_mand) return;
    try {
      console.log("Password: ", accountPassword);
      const res = await updateUser({
        btlhcm_nd_mand: user.btlhcm_nd_mand,
        btlhcm_nd_matkhau: accountPassword,
      });
      if (res.ok) {
        toast.success("Cập nhật mật khẩu thành công");
        setIsAccountOpen(false);
        setAccountPassword(accountPassword);
      } else {
        toast.error("Cập nhật mật khẩu thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật mật khẩu");
    }
  };

  // Kiểm tra vai trò của người dùng
  const isPermission = permissions.includes("MANAGE_ROLES");

  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-200">
      {/* Navigation Menu bên trái */}
      <NavigationMenu>
        <NavigationMenuList>
          {/* Danh bạ Thành phố Hồ Chí Minh */}
          {ward.wardId.length === 0 && (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/danh-ba">Danh bạ BTL TPHCM</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          {/* Danh bạ Cấp Phường */}
          {ward.wardId.length === 0 && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Danh bạ Phường/Xã</NavigationMenuTrigger>
              <NavigationMenuContent className="z-50">
                <div className="w-[400px] md:w-[500px] lg:w-[600px] p-4">
                  <div className="grid gap-3 md:grid-cols-2 max-h-[300px] overflow-y-auto pr-2">
                    {loading ? (
                      <div className="col-span-2 p-2 text-sm text-muted-foreground">
                        Đang tải dữ liệu...
                      </div>
                    ) : wards.length > 0 ? (
                      wards.map((ward) => (
                        <NavigationMenuLink
                          key={ward.btlhcm_px_mapx}
                          asChild
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <Link
                            href={`/danh-ba?phuongxa=${ward.btlhcm_px_mapx}`}
                          >
                            <div className="text-sm font-medium leading-none">
                              {ward.btlhcm_px_tenpx}
                            </div>
                            {ward.btlhcm_px_mota && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {ward.btlhcm_px_mota}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      ))
                    ) : (
                      <div className="col-span-2 p-2 text-sm text-muted-foreground">
                        Không có dữ liệu Quân khu
                      </div>
                    )}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          {ward.wardId.length > 0 && (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={`/danh-ba?phuongxa=${ward.wardId}`}>
                  Danh bạ {ward.wardName}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          {/* Phân quyền Người dùng () */}
          {isPermission && (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/quan-ly-nguoi-dung">
                  Quản lý Người dùng (Quản trị hệ thống)
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}

          {/* Danh sách Đơn vị */}
          {isPermission && (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/quan-ly-don-vi">Quản lý Đơn vị</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Nút Đăng xuất bên phải */}
      <div className="flex items-center">
        {/* Thông tin người dùng */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAccountOpen(true)}
        >
          Tài khoản
        </Button>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  href="/"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await userLogout();
                      localStorage.removeItem("token");
                      window.location.href = "/dang-nhap";
                    } catch (error) {
                      console.error("Logout error:", error);
                    }
                  }}
                >
                  Đăng xuất
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin tài khoản</DialogTitle>
            <DialogDescription>
              Xem thông tin tài khoản hiện tại của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="account-username">Mã người dùng</Label>
                <Input
                  id="account-username"
                  value={user?.btlhcm_nd_mand ?? ""}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-username">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="account-password"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    disabled={!showPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2 border-t pt-4">
                <Label>Vai trò</Label>
                <div className="flex flex-wrap gap-2">
                  {userRoles?.length ? (
                    userRoles.map((r) => (
                      <span
                        key={r.btlhcm_vt_mavt}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                      >
                        {r.btlhcm_vt_tenvt}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Không có vai trò
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleChangePassword}>
              Thay đổi mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
