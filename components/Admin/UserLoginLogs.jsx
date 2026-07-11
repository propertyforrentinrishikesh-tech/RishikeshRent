"use client";
import { Trash, Users, Shield, Calendar as CalendarIcon, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const UserLoginLogs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/getUserById");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/getUserById/${id}`, { method: "DELETE" });
      toast.success("User deleted successfully", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">User Login Logs</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all registered users and their authentication methods.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="w-full">
          <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden h-full">
            <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                <CardTitle className="text-lg font-semibold text-slate-800">Registered Users</CardTitle>
                <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                  {users.length} Total
                </Badge>
              </div>
              <CardDescription className="text-slate-500 mt-1">A complete list of users who have signed up or logged in.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                    <TableRow className="hover:bg-transparent border-0">
                      <TableHead className="text-slate-500 font-medium h-12 pl-6">User Details</TableHead>
                      <TableHead className="text-slate-500 font-medium h-12">Contact</TableHead>
                      <TableHead className="text-slate-500 font-medium h-12">Provider</TableHead>
                      <TableHead className="text-slate-500 font-medium h-12 text-right">Registered On</TableHead>
                      <TableHead className="text-slate-500 font-medium text-right pr-6 h-12 w-32">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-b border-slate-50">
                          <TableCell className="pl-6 py-4">
                            <div className="flex flex-col gap-2">
                              <Skeleton className="h-5 w-[140px] rounded-md" />
                              <Skeleton className="h-4 w-[180px] rounded-md" />
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-4 w-[120px] rounded-md" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-6 w-[80px] rounded-full" />
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <Skeleton className="h-4 w-[100px] rounded-md ml-auto" />
                          </TableCell>
                          <TableCell className="text-right pr-6 py-4">
                            <Skeleton className="h-9 w-9 rounded-xl ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                          <TableCell className="pl-6 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-slate-800">{user.name || "N/A"}</span>
                              <span className="text-sm text-slate-500">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 align-top">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-700">{user.phone || "Not provided"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 align-top">
                            <Badge 
                              variant="outline" 
                              className={`
                                font-medium capitalize 
                                ${user.provider === 'google' ? 'bg-red-50 text-red-700 border-red-100' : ''}
                                ${user.provider === 'credentials' || !user.provider ? 'bg-slate-100 text-slate-700 border-slate-200' : ''}
                              `}
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              {user.provider || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-4 align-top">
                            <div className="flex items-center justify-end gap-1.5 text-slate-600 text-sm">
                              <CalendarIcon className="w-4 h-4 text-slate-400" />
                              {new Date(user.createdAt).toLocaleDateString("en-In", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6 py-4 align-top">
                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(user._id)}
                                className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                title="Delete User"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <Users className="w-8 h-8 mb-2 text-slate-300" />
                            <p>No users found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserLoginLogs;