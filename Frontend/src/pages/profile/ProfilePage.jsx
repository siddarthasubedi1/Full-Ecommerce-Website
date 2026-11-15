
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    UserRound,
    Mail,
    CalendarDays,
    LockKeyhole,
    Save,
    LoaderCircle,
} from "lucide-react";

import {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
} from "../../services/profileService";


export default function ProfilePage() {

    const navigate = useNavigate();

    // Store the user's profile information
    const [profile, setProfile] = useState(null);

    // Store the editable name
    const [name, setName] = useState("");

    // Store password form information
    const [passwordForm, setPasswordForm] = useState({
        old_password: "",
        password: "",
        password2: "",
    });

    // Loading and message states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // Load the user's profile when the page opens
    useEffect(() => {

        const loadProfile = async () => {

            // Check whether the user is logged in
            if (!localStorage.getItem("access")) {
                navigate("/login");
                return;
            }

            try {

                const data = await getMyProfile();

                setProfile(data);
                setName(data.name);

            } catch (err) {

                setError(err.message);

                // If the token is invalid, send the user to login
                if (
                    err.message.includes("401") ||
                    err.message.toLowerCase().includes("authentication")
                ) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");

                    window.dispatchEvent(new Event("auth-changed"));

                    navigate("/login");
                }

            } finally {
                setLoading(false);
            }
        };

        loadProfile();

    }, [navigate]);


    // Update the name input
    const handleNameChange = (e) => {
        setName(e.target.value);
    };


    // Update password form inputs
    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // Save profile changes
    const handleProfileSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Name cannot be empty.");
            return;
        }

        setSaving(true);

        try {

            const data = await updateMyProfile({
                name: name.trim(),
            });

            // Update profile information on the screen
            setProfile(data.data);
            setName(data.data.name);

            setSuccess("Profile updated successfully.");

        } catch (err) {

            setError(err.message);

        } finally {

            setSaving(false);

        }
    };


    // Change password
    const handlePasswordSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Check whether new passwords match
        if (passwordForm.password !== passwordForm.password2) {
            setError("New passwords do not match.");
            return;
        }

        setChangingPassword(true);

        try {

            await changeMyPassword(passwordForm);

            // Clear password fields
            setPasswordForm({
                old_password: "",
                password: "",
                password2: "",
            });

            setSuccess("Password changed successfully. Please log in again.");

            // Log the user out after changing the password
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            window.dispatchEvent(new Event("auth-changed"));

            // Send the user to the login page
            navigate("/login");

        } catch (err) {

            setError(err.message);

        } finally {

            setChangingPassword(false);

        }
    };


    // Show loading screen while fetching profile data
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <LoaderCircle
                    className="animate-spin text-red-600"
                    size={35}
                />

                <p className="ml-3 text-gray-600">
                    Loading your profile...
                </p>

            </div>
        );
    }


    return (

        <main className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="mx-auto max-w-5xl">

                {/* Page heading */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        My Profile
                    </h1>

                    <p className="mt-2 text-gray-500">
                        View and manage your account information.
                    </p>

                </div>


                {/* Error message */}
                {error && (

                    <div
                        role="alert"
                        className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error}
                    </div>

                )}


                {/* Success message */}
                {success && (

                    <div
                        role="status"
                        className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                    >
                        {success}
                    </div>

                )}


                {profile && (

                    <div className="grid gap-7 md:grid-cols-2">


                        {/* PROFILE INFORMATION */}
                        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                            <div className="mb-6 flex items-center gap-3">

                                <div className="rounded-full bg-red-50 p-3 text-red-600">
                                    <UserRound size={25} />
                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Personal Information
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Update your account details.
                                    </p>

                                </div>

                            </div>


                            {/* Profile form */}
                            <form
                                onSubmit={handleProfileSubmit}
                                className="space-y-5"
                            >

                                {/* Name */}
                                <div>

                                    <label
                                        htmlFor="profile-name"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <UserRound
                                            size={19}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            id="profile-name"
                                            type="text"
                                            value={name}
                                            onChange={handleNameChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        />

                                    </div>

                                </div>


                                {/* Email */}
                                <div>

                                    <label
                                        htmlFor="profile-email"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={19}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            id="profile-email"
                                            type="email"
                                            value={profile.email}
                                            readOnly
                                            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 py-3 pl-10 pr-4 text-gray-500"
                                        />

                                    </div>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Email address cannot be changed here.
                                    </p>

                                </div>


                                {/* Account creation date */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Account Created
                                    </label>

                                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">

                                        <CalendarDays size={19} />

                                        {new Date(
                                            profile.created_at
                                        ).toLocaleDateString()}

                                    </div>

                                </div>


                                {/* Save button */}
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    <Save size={18} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </form>

                        </section>


                        {/* CHANGE PASSWORD */}
                        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                            <div className="mb-6 flex items-center gap-3">

                                <div className="rounded-full bg-red-50 p-3 text-red-600">
                                    <LockKeyhole size={25} />
                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Change Password
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Keep your account secure.
                                    </p>

                                </div>

                            </div>


                            <form
                                onSubmit={handlePasswordSubmit}
                                className="space-y-5"
                            >

                                {/* Current password */}
                                <div>

                                    <label
                                        htmlFor="old-password"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Current Password
                                    </label>

                                    <input
                                        id="old-password"
                                        type="password"
                                        name="old_password"
                                        value={passwordForm.old_password}
                                        onChange={handlePasswordChange}
                                        required
                                        autoComplete="current-password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        placeholder="Enter current password"
                                    />

                                </div>


                                {/* New password */}
                                <div>

                                    <label
                                        htmlFor="new-password"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        New Password
                                    </label>

                                    <input
                                        id="new-password"
                                        type="password"
                                        name="password"
                                        value={passwordForm.password}
                                        onChange={handlePasswordChange}
                                        required
                                        autoComplete="new-password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        placeholder="Enter new password"
                                    />

                                </div>


                                {/* Confirm new password */}
                                <div>

                                    <label
                                        htmlFor="confirm-password"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Confirm New Password
                                    </label>

                                    <input
                                        id="confirm-password"
                                        type="password"
                                        name="password2"
                                        value={passwordForm.password2}
                                        onChange={handlePasswordChange}
                                        required
                                        autoComplete="new-password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        placeholder="Confirm new password"
                                    />

                                </div>


                                {/* Change password button */}
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    <LockKeyhole size={18} />

                                    {changingPassword
                                        ? "Changing Password..."
                                        : "Change Password"}

                                </button>

                            </form>

                        </section>

                    </div>

                )}

            </div>

        </main>

    );

}
