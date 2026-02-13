"use client";

import { useState } from "react";
import {
    User,
    Users,
    ShieldCheck,
    Lock,
    Settings2,
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    Bell
} from "lucide-react";
import SuccessModal from "@/components/admin/SuccessModal";
import AddUserModal from "@/components/admin/AddUserModal";
import EditUserModal from "@/components/admin/EditUserModal";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import AddStaffModal from "@/components/admin/AddStaffModal";
import EditStaffModal from "@/components/admin/EditStaffModal";
import DeleteStaffModal from "@/components/admin/DeleteStaffModal";

const SIDEBAR_ITEMS = [
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "users", label: "Users Management", icon: Users },
    { id: "staff", label: "Staff Management", icon: ShieldCheck },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Bell },
];

const INITIAL_USERS = [
    { id: 1, firstName: "Guy", lastName: "Hawkins", email: "Tanya.Hill@Example.Com", role: "Owner", status: "Active" },
    { id: 2, firstName: "Cameron", lastName: "Williamson", email: "Nevaeh.Simmons@Example.Com", role: "Renter", status: "Active" },
    { id: 3, firstName: "Bessie", lastName: "Cooper", email: "Jackson.Graham@Example.Com", role: "Owner", status: "Active" },
    { id: 4, firstName: "Wade", lastName: "Warren", email: "Nathan.Roberts@Example.Com", role: "Owner", status: "Active" },
    { id: 5, firstName: "Kristin", lastName: "Watson", email: "Jackson.Graham@Example.Com", role: "Renter", status: "Active" },
    { id: 6, firstName: "Courtney", lastName: "Henry", email: "Felicia.Reid@Example.Com", role: "Renter", status: "Inactive" },
];

const INITIAL_STAFF = [
    { id: 101, firstName: "Guy", lastName: "Hawkins", email: "Tanya.Hill@Example.Com", role: "Inspector", status: "Active" },
    { id: 102, firstName: "Cameron", lastName: "Williamson", email: "Nevaeh.Simmons@Example.Com", role: "Manager", status: "Active" },
];

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    // User Management State
    const [users, setUsers] = useState(INITIAL_USERS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Staff Management State
    const [staff, setStaff] = useState(INITIAL_STAFF);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
    const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);

    // Feedback State
    const [showSuccess, setShowSuccess] = useState(false);
    const [successTitle, setSuccessTitle] = useState("Profile Updated");
    const [successMessage, setSuccessMessage] = useState("Your profile information has been successfully updated.");

    // Security State
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Preferences State
    const [preferences, setPreferences] = useState({
        allAssigned: true,
        activity: false,
        kycTasks: true,
        listings: false
    });

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessTitle("Profile Updated");
        setSuccessMessage("Your profile information has been successfully updated.");
        setShowSuccess(true);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessTitle("Password Updated");
        setSuccessMessage("Your password has been successfully updated.");
        setShowSuccess(true);
    };

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAddUser = (user: any) => {
        setUsers([user, ...users]);
        setSuccessTitle("User Added");
        setSuccessMessage("The new user has been successfully added.");
        setShowSuccess(true);
    };

    const handleAddStaff = (newStaff: any) => {
        setStaff([newStaff, ...staff]);
        setSuccessTitle("Staff Added");
        setSuccessMessage("The new staff member has been successfully added.");
        setShowSuccess(true);
    };

    const handleEditUser = (updatedUser: any) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setSuccessTitle("User Updated");
        setSuccessMessage("The user information has been successfully updated.");
        setShowSuccess(true);
    };

    const handleEditStaff = (updatedStaff: any) => {
        setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s));
        setSuccessTitle("Staff Updated");
        setSuccessMessage("The staff information has been successfully updated.");
        setShowSuccess(true);
    };

    const handleDeleteUser = () => {
        if (selectedUser) {
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setSuccessTitle("User Deleted");
            setSuccessMessage("The user has been successfully removed.");
            setShowSuccess(true);
        }
    };

    const handleDeleteStaff = () => {
        if (selectedStaff) {
            setStaff(staff.filter(s => s.id !== selectedStaff.id));
            setSuccessTitle("Staff Deleted");
            setSuccessMessage("The staff member has been successfully removed.");
            setShowSuccess(true);
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat tracking-tight leading-none text-left">
                    Account Settings
                </h1>
                {activeTab === "users" && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#002B7F] text-white rounded-[16px] font-bold text-[15px] hover:bg-opacity-90 transition-all shadow-md shadow-blue-900/10 font-montserrat"
                    >
                        <Plus size={18} />
                        Add User
                    </button>
                )}
                {activeTab === "staff" && (
                    <button
                        onClick={() => setIsAddStaffModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#002B7F] text-white rounded-[16px] font-bold text-[15px] hover:bg-opacity-90 transition-all shadow-md shadow-blue-900/10 font-montserrat"
                    >
                        <Plus size={18} />
                        Add Staff
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full lg:w-[300px] bg-white border border-gray-100 rounded-[24px] p-4 h-fit shadow-sm text-left">
                    <div className="flex flex-col gap-2">
                        {SIDEBAR_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-[16px] transition-all duration-300 group font-montserrat ${isActive
                                        ? "bg-[#002B7F] text-white shadow-md shadow-blue-900/10"
                                        : "text-[#1A1A1A] hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon
                                        size={20}
                                        className={isActive ? "text-white" : "text-[#1A1A1A] group-hover:text-[#002B7F]"}
                                    />
                                    <span className={`text-[15px] font-bold ${isActive ? "text-white" : "text-[#1A1A1A]"}`}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white border border-gray-100 rounded-[24px] p-10 shadow-sm h-fit">
                    {activeTab === "profile" && (
                        <div className="flex flex-col gap-8">
                            <h2 className="text-[22px] font-bold text-[#1A1A1A] font-montserrat tracking-tight text-left">
                                Profile Information
                            </h2>

                            <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 text-left">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[14px] font-medium text-gray-400 font-montserrat">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Admin User"
                                        placeholder="Enter full name"
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[14px] text-[15px] font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-gray-200 font-montserrat"
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[14px] font-medium text-gray-400 font-montserrat">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="admin@househub.com"
                                        placeholder="Enter email address"
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[14px] text-[15px] font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-gray-200 font-montserrat"
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[14px] font-medium text-gray-400 font-montserrat">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="+234 801 234 5678"
                                        placeholder="Enter phone number"
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[14px] text-[15px] font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-gray-200 font-montserrat"
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[14px] font-medium text-gray-400 font-montserrat">
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Super Admin"
                                        placeholder="Enter role"
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[14px] text-[15px] font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-gray-200 font-montserrat"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-fit px-12 py-4 bg-[#002B7F] text-white rounded-[16px] font-bold text-[16px] hover:bg-opacity-90 transition-all shadow-md mt-4 font-montserrat"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="flex flex-col gap-8">
                            <h2 className="text-[22px] font-bold text-[#1A1A1A] font-montserrat tracking-tight text-left">
                                User Management
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Name</th>
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Email</th>
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Role</th>
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Status</th>
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {users.map((user) => (
                                            <tr key={user.id} className="group hover:bg-gray-50/50 transition-all">
                                                <td className="py-5 text-[14px] font-medium text-[#1A1A1A] font-montserrat">
                                                    {user.firstName} {user.lastName || ""}
                                                </td>
                                                <td className="py-5 text-[14px] font-medium text-gray-500 font-montserrat">
                                                    {user.email}
                                                </td>
                                                <td className="py-5 text-[14px] font-medium text-gray-500 font-montserrat">
                                                    {user.role}
                                                </td>
                                                <td className="py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold font-montserrat ${user.status === "Active"
                                                        ? "bg-green-50 text-green-500"
                                                        : "bg-red-50 text-red-500"
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            className="p-2 text-[#0095FF] hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "staff" && (
                        <div className="flex flex-col gap-8">
                            <h2 className="text-[22px] font-bold text-[#1A1A1A] font-montserrat tracking-tight text-left">
                                Staff Management
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Name</th>
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Email</th>
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Role</th>
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Status</th>
                                            <th className="text-left py-4 text-[15px] font-bold text-[#1A1A1A] font-montserrat">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {staff.map((member) => (
                                            <tr key={member.id} className="group hover:bg-gray-50/50 transition-all">
                                                <td className="py-5 text-[14px] font-medium text-[#1A1A1A] font-montserrat">
                                                    {member.firstName} {member.lastName}
                                                </td>
                                                <td className="py-5 text-[14px] font-medium text-gray-500 font-montserrat">
                                                    {member.email}
                                                </td>
                                                <td className="py-5 text-[14px] font-medium text-gray-500 font-montserrat">
                                                    {member.role}
                                                </td>
                                                <td className="py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold font-montserrat ${member.status === "Active"
                                                        ? "bg-green-50 text-green-500"
                                                        : "bg-red-50 text-red-500"
                                                        }`}>
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStaff(member);
                                                                setIsEditStaffModalOpen(true);
                                                            }}
                                                            className="p-2 text-[#0095FF] hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStaff(member);
                                                                setIsDeleteStaffModalOpen(true);
                                                            }}
                                                            className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="flex flex-col gap-10">
                            <h2 className="text-[22px] font-bold text-[#1A1A1A] font-montserrat tracking-tight text-left">
                                Change Password
                            </h2>

                            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6 text-left max-w-full">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[14px] font-medium text-gray-400 font-montserrat">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            defaultValue="**********"
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[14px] text-[15px] font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-montserrat"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[14px] font-medium text-gray-400 font-montserrat">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[14px] text-[15px] font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-montserrat"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-[12px] text-gray-300 font-medium font-montserrat">
                                        Between 8 and 72 characters
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[14px] font-medium text-gray-400 font-montserrat">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[14px] text-[15px] font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-montserrat"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-[12px] text-gray-300 font-medium font-montserrat">
                                        Between 8 and 72 characters
                                    </p>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="w-fit px-12 py-4 bg-[#002B7F] text-white rounded-full font-bold text-[16px] hover:bg-opacity-90 transition-all shadow-md font-montserrat"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === "preferences" && (
                        <div className="flex flex-col gap-10">
                            <h2 className="text-[22px] font-bold text-[#1A1A1A] font-montserrat tracking-tight text-left">
                                Notification Preferences
                            </h2>

                            <div className="flex flex-col border border-gray-100 rounded-[24px] divide-y divide-gray-100">
                                <div className="flex items-center justify-between p-8">
                                    <span className="text-[16px] font-bold text-[#1A1A1A] font-montserrat">
                                        All Assigned
                                    </span>
                                    <button
                                        onClick={() => togglePreference("allAssigned")}
                                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${preferences.allAssigned ? "bg-[#002B7F]" : "bg-gray-200"}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${preferences.allAssigned ? "translate-x-7" : ""}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-8">
                                    <span className="text-[16px] font-bold text-[#1A1A1A] font-montserrat">
                                        Activity
                                    </span>
                                    <button
                                        onClick={() => togglePreference("activity")}
                                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${preferences.activity ? "bg-[#002B7F]" : "bg-gray-200"}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${preferences.activity ? "translate-x-7" : ""}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-8">
                                    <span className="text-[16px] font-bold text-[#1A1A1A] font-montserrat">
                                        KYC Tasks
                                    </span>
                                    <button
                                        onClick={() => togglePreference("kycTasks")}
                                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${preferences.kycTasks ? "bg-[#002B7F]" : "bg-gray-200"}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${preferences.kycTasks ? "translate-x-7" : ""}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-8">
                                    <span className="text-[16px] font-bold text-[#1A1A1A] font-montserrat">
                                        Listings
                                    </span>
                                    <button
                                        onClick={() => togglePreference("listings")}
                                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${preferences.listings ? "bg-[#002B7F]" : "bg-gray-200"}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${preferences.listings ? "translate-x-7" : ""}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== "profile" && activeTab !== "users" && activeTab !== "staff" && activeTab !== "security" && activeTab !== "preferences" && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <p className="text-[16px] font-medium italic font-montserrat">
                                Content for {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label} will be implemented soon.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser}
            />

            <AddStaffModal
                isOpen={isAddStaffModalOpen}
                onClose={() => setIsAddStaffModalOpen(false)}
                onAdd={handleAddStaff}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                onSave={handleEditUser}
            />

            <EditStaffModal
                isOpen={isEditStaffModalOpen}
                onClose={() => setIsEditStaffModalOpen(false)}
                staff={selectedStaff}
                onSave={handleEditStaff}
            />

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDeleteUser}
            />

            <DeleteStaffModal
                isOpen={isDeleteStaffModalOpen}
                onClose={() => setIsDeleteStaffModalOpen(false)}
                onDelete={handleDeleteStaff}
            />

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title={successTitle}
                message={successMessage}
            />
        </div>
    );
}
