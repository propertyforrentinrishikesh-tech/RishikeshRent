'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Pencil, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";

const CreateUser = () => {
    const { register, handleSubmit, setValue, reset } = useForm();

    const [editItem, setEditItem] = useState(null)
    const [allUsers, setAllUsers] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/admin/createUser`);
                const res = await response.json();

                if (response.ok) {
                    setAllUsers(res.admins);
                } else {
                    toast.error(res.message, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
                }
            } catch (error) {
                toast.error(error.message, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        }

        fetchUsers();
    }, [])

    const handleUpdate = async (data) => {
        try {
            const response = await fetch(`/api/admin/createUser`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const res = await response.json();

            if (response.ok) {
                toast.success("SubAdmin updated successfully!", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                setEditItem(null);
                window.location.reload();
            } else {
                toast.error(res.message, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Error updating SubAdmin", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
    };

    const handleEdit = (id) => {
        const itemToEdit = allUsers.find((item) => item._id === id);
        setValue("fullName", itemToEdit.fullName);
        setValue("phoneNumber", itemToEdit.phoneNumber);
        setValue("email", itemToEdit.email);
        setEditItem(id);
    };

    const deleteItem = async (id) => {
        try {
            const response = await fetch(`/api/admin/createUser`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                toast.success("SubAdmin deleted successfully!", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                window.location.reload();
            } else {
                toast.error("Failed to delete SubAdmin", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            console.error("Error deleting SubAdmin:", error);
        }
    };

    const onSubmit = async (data) => {
        if (!data.password || !data.fullName || !data.phoneNumber || !data.email) {
            toast.error("All fields are required", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            return
        }
        if (data.phoneNumber.length !== 10) {
            toast.error("Invalid phone number. Please enter a 10-digit number", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            return
        }
        try {
            const response = await fetch("/api/admin/createUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const res = await response.json()

            if (response.ok) {
                toast.success(res.message, { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                reset();
                window.location.reload();
            } else {
                toast.error(`Failed to add SubAdmin: ${res.message}`, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 p-6 font-sans">
            <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-slate-800">Create Sub-Admin</CardTitle>
                    <CardDescription className="text-slate-500">Add a new user with administrative privileges to manage the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="fullName" className="text-slate-600 font-medium text-sm ml-1">Full Name</Label>
                                <Input placeholder="John Doe" id="fullName" className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 capitalize bg-slate-50/50 transition-colors hover:bg-slate-50" {...register('fullName')} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phoneNumber" className="text-slate-600 font-medium text-sm ml-1">Contact Number</Label>
                                <Input placeholder="1234567890" id="phoneNumber" maxLength={10} className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50" {...register('phoneNumber')} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-slate-600 font-medium text-sm ml-1">Email Address</Label>
                                <Input placeholder="johndoe@example.com" id="email" className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50" {...register('email')} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password" className="text-slate-600 font-medium text-sm ml-1">Password</Label>
                                <div className="relative">
                                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" id="password" className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 pr-10 bg-slate-50/50 transition-colors hover:bg-slate-50" {...register('password')} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeOffIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button type="submit" className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all hover:shadow-md">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create User
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                        <TableRow className="hover:bg-transparent border-0">
                            <TableHead className="text-slate-500 font-medium w-16 text-center h-12">#</TableHead>
                            <TableHead className="text-slate-500 font-medium h-12">Full Name</TableHead>
                            <TableHead className="text-slate-500 font-medium h-12">Contact Number</TableHead>
                            <TableHead className="text-slate-500 font-medium h-12">Email</TableHead>
                            <TableHead className="text-slate-500 font-medium text-right pr-6 h-12">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allUsers.length > 0 ? allUsers.map((user, index) => (
                            <TableRow key={user._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                <TableCell className="text-slate-400 text-center py-4">{index + 1}</TableCell>
                                <TableCell className="font-medium text-slate-700 py-4 capitalize">{user.fullName}</TableCell>
                                <TableCell className="text-slate-600 py-4">+91 {user.phoneNumber}</TableCell>
                                <TableCell className="text-slate-600 py-4">{user.email}</TableCell>
                                <TableCell className="text-right pr-6 py-4">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" onClick={() => handleEdit(user._id)} variant="ghost" className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" onClick={() => deleteItem(user._id)} variant="ghost" className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell className="text-center py-12 text-slate-400" colSpan={5}>
                                    No Sub-Admins found. Add a new user above.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {editItem && (
                <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
                    <DialogContent className="max-w-md rounded-[24px] p-6 border-slate-100 shadow-xl bg-white gap-0 font-sans">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-semibold text-slate-800">Edit Sub-Admin Details</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-fullName" className="text-slate-600 font-medium text-sm ml-1">Full Name</Label>
                                <Input id="edit-fullName" placeholder="John Doe" className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 capitalize bg-slate-50/50 transition-colors hover:bg-slate-50" {...register('fullName')} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-phoneNumber" className="text-slate-600 font-medium text-sm ml-1">Contact Number</Label>
                                <Input id="edit-phoneNumber" placeholder="1234567890" maxLength={10} className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50" {...register('phoneNumber')} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-email" className="text-slate-600 font-medium text-sm ml-1">Email Address</Label>
                                <Input id="edit-email" placeholder="johndoe@example.com" className="h-11 rounded-xl border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed" disabled {...register('email')} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-password" className="text-slate-600 font-medium text-sm ml-1">New Password</Label>
                                <div className="relative">
                                    <Input id="edit-password" type={showPassword ? "text" : "password"} placeholder="Leave blank to keep current" className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 pr-10 bg-slate-50/50 transition-colors hover:bg-slate-50" {...register('password')} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeOffIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-50">
                                <Button type="button" variant="ghost" onClick={() => setEditItem(null)} className="h-11 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">Cancel</Button>
                                <Button type="submit" className="h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-6 font-medium transition-all hover:shadow-md">Save Changes</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default CreateUser

