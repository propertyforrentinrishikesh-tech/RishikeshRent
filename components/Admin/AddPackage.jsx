'use client'

import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { NumericFormat } from "react-number-format"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Edit, Loader2, Pencil, Trash2 } from "lucide-react"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"

const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

const slugify = (str) => {
    if (!str) return "";
    return String(str)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
};

const AddPackage = ({ id }) => {
    const { handleSubmit, register, setValue, reset } = useForm()
    const subMenuId = id
    const [packageCode, setPackageCode] = useState("")
    const [selectedPriceUnit, setSelectedPriceUnit] = useState("")
    const [priceValue, setPriceValue] = useState(0)
    const [editingPackageId, setEditingPackageId] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [subMenuItems, setSubMenuItems] = useState([])

    const fetchSubMenuItems = async () => {
        try {
            const response = await fetch(`/api/getSubMenuById/${subMenuId}`);
            const data = await response.json();
            // console.log(data)
            setSubMenuItems(data);
        } catch (error) {
            console.error("Error fetching sub-menu items:", error);
        }
    }

    const resetToCreateMode = () => {
        const newCode = generateCode();
        setEditingPackageId(null);
        setPackageCode(newCode);
        setSelectedPriceUnit("");
        setPriceValue(0);
        reset({
            packages: {
                packageName: "",
                price: 0,
                priceUnit: "",
                packageCode: newCode,
            },
        });
    }

    useEffect(() => {
        const newCode = generateCode();
        setPackageCode(newCode);
        setValue("packages.packageCode", newCode);
        fetchSubMenuItems();
    }, [setValue])

    const startEdit = (pkg) => {
        setEditingPackageId(pkg._id);
        setPackageCode(pkg.packageCode || "");
        setSelectedPriceUnit(pkg.priceUnit || "");
        setPriceValue(pkg.price || 0);
        setValue("packages.packageName", pkg.packageName || "");
        setValue("packages.price", pkg.price || 0);
        setValue("packages.priceUnit", pkg.priceUnit || "");
        setValue("packages.packageCode", pkg.packageCode || "");
    };

    const deletePackage = async (id) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/admin/website-manage/addPackage`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                toast.success("Package deleted successfully!", { style: { borderRadius: "10px", border: "2px solid green" } })
                window.location.reload()
                setIsLoading(false)
            } else {
                toast.error("Failed to delete package", { style: { borderRadius: "10px", border: "2px solid red" } })
                setIsLoading(false)
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "2px solid red" } })
        }
    }

    const toggleSwitch = async (pkgId, currentStatus) => {
        try {
            const response = await fetch(`/api/admin/website-manage/addPackage`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId, active: !currentStatus }),
            });

            if (response.ok) {
                setSubMenuItems((prevSubMenu) => ({
                    ...prevSubMenu,
                    packages: prevSubMenu.packages.map((pkg) =>
                        pkg._id === pkgId ? { ...pkg, active: !pkg.active } : pkg
                    ),
                }));
            } else {
                toast.error("Failed to update submenu status", { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch (error) {
            console.error("Error updating submenu status:", error);
        }
    };
    const toggleIsTrending = async (pkgId, currentStatus) => {
        try {
            const response = await fetch(`/api/admin/website-manage/addPackage`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId, isTrending: !currentStatus }),
            });

            if (response.ok) {
                setSubMenuItems((prevSubMenu) => ({
                    ...prevSubMenu,
                    packages: prevSubMenu.packages.map((pkg) =>
                        pkg._id === pkgId ? { ...pkg, isTrending: !pkg.isTrending } : pkg
                    ),
                }));
                toast.success("Package status updated successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
            } else {
                toast.error("Failed to update submenu status", { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch (error) {
            console.error("Error updating submenu status:", error);
        }
    };

    const onSubmit = async (data) => {

        if (!data.packages.packageName || !data.packages.priceUnit) {
            toast.error("All fields are required", { style: { borderRadius: "10px", border: "2px solid red" } })
            return
        }
        setIsSubmitting(true)

        try {
            const isEditMode = Boolean(editingPackageId);

            const response = await fetch("/api/admin/website-manage/addPackage", {
                method: isEditMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    isEditMode
                        ? {
                            pkgId: editingPackageId,
                            packageName: data.packages.packageName,
                            price: Number(data.packages.price) || 0,
                            priceUnit: data.packages.priceUnit,
                            packageCode,
                            slug: slugify(data.packages.packageName),
                        }
                        : {
                            subMenuId,
                            packages: {
                                packageName: data.packages.packageName,
                                price: Number(data.packages.price) || 0,
                                priceUnit: data.packages.priceUnit,
                                packageCode,
                                link: packageCode,
                                active: true,
                                order: (subMenuItems?.packages?.length || 0) + 1,
                                slug: slugify(data.packages.packageName),
                            },
                        }
                ),
            });

            if (response.ok) {
                toast.success(
                    isEditMode ? "Package updated successfully!" : "Package added successfully!",
                    { style: { borderRadius: "10px", border: "2px solid green" } }
                )
                await fetchSubMenuItems();
                resetToCreateMode();
            } else {
                toast.error(
                    isEditMode ? "Failed to update package" : "Failed to add package",
                    { style: { borderRadius: "10px", border: "2px solid red" } }
                )
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "2px solid red" } })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <form className="flex flex-col items-center justify-center gap-8 my-20 bg-blue-100 w-full max-w-xl md:max-w-7xl mx-auto p-4 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex md:flex-row flex-col items-center md:items-end gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="packageCode" className="font-semibold">Package Code</label>
                        <Input name="packageCode" className="w-32 border-2 border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0 font-bold" readOnly value={packageCode} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="packageName" className="font-semibold">Package Name</label>
                        <Input name="packageName" className="w-full border-2 font-bold border-blue-600 focus:border-dashed focus:border-blue-500 focus:outline-none focus-visible:ring-0" {...register('packages.packageName')} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="price" className="font-semibold">Package Price</label>
                        <NumericFormat thousandSeparator={true} prefix="₹" name="price" value={priceValue} className="px-2 font-bold py-1 w-full border-2 rounded-md border-blue-600 focus:border-dashed focus:border-blue-500 bg-transparent focus:outline-none focus-visible:ring-0" onValueChange={(values) => {
                            const value = values.floatValue || 0;
                            setPriceValue(value);
                            setValue("packages.price", value);
                        }} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="priceUnit" className="font-semibold">Price Unit</label>
                        <Select value={selectedPriceUnit} name="priceUnit" className="p-2 border border-gray-300 rounded-md" onValueChange={(value) => {
                            setSelectedPriceUnit(value);
                            setValue("packages.priceUnit", value);
                        }}>
                            <SelectTrigger className="w-52 border-2 bg-transparent border-blue-600 focus:border-blue-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                                <SelectValue placeholder="Select Price Unit" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-blue-600 bg-blue-100">
                                <SelectGroup>
                                    <SelectItem className="focus:bg-blue-300 font-bold" value="Per Person">Per Person</SelectItem>
                                    <SelectItem className="focus:bg-blue-300 font-bold" value="2 Person">2 Person</SelectItem>
                                    <SelectItem className="focus:bg-blue-300 font-bold" value="Group">Group</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {editingPackageId ? "Update Package" : "Add Package"}
                    </Button>
                    {editingPackageId ? (
                        <Button type="button" variant="outline" onClick={resetToCreateMode}>Cancel Edit</Button>
                    ) : null}
                </div>
            </form>

            <div className="bg-blue-100 p-4 rounded-lg shadow max-w-5xl mx-auto w-full overflow-x-auto lg:overflow-visible text-center">
                <Table className="w-full min-w-max lg:min-w-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center !text-black w-1/2">Package Name</TableHead>
                            <TableHead className="text-center !text-black w-1/4">Order</TableHead>
                            <TableHead className="text-center !text-black w-1/2">isTrending</TableHead>
                            <TableHead className="w-1/2 !text-black text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subMenuItems?.packages?.length > 0 ? (
                            subMenuItems?.packages?.map((pkg) => (
                                <TableRow key={pkg._id}>
                                    <TableCell className="border font-semibold border-blue-600">{pkg.packageName}</TableCell>
                                    <TableCell className="border font-semibold border-blue-600">{pkg.order}</TableCell>
                                    <TableCell className="border font-semibold border-blue-600">
                                        <div className="flex items-center justify-center gap-6">
                                            <Switch
                                                id={`switch-${pkg._id}`}
                                                checked={pkg.isTrending}
                                                onCheckedChange={() => toggleIsTrending(pkg._id, pkg.isTrending)}
                                                className={`rounded-full transition-colors ${pkg.isTrending ? "!bg-green-500" : "!bg-red-500"}`}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="border font-semibold border-blue-600">
                                        <div className="flex items-center justify-center gap-6">
                                            <Button size="icon" variant="outline" onClick={() => startEdit(pkg)} title="Edit data here">
                                                <Edit className="w-4 h-4" />
                                            </Button>

                                            <Button size="icon" variant="outline" asChild title="Edit full package page">
                                                <Link href={`/admin/editPackage/${pkg._id}`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>

                                            <Button size="icon" disabled={isLoading} onClick={() => deletePackage(pkg._id)} variant="destructive">
                                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id={`switch-${pkg._id}`}
                                                    checked={pkg.active}
                                                    onCheckedChange={() => toggleSwitch(pkg._id, pkg.active)}
                                                    className={`rounded-full transition-colors ${pkg.active ? "!bg-green-500" : "!bg-red-500"}`}
                                                />
                                                <Label htmlFor={`switch-${pkg._id}`} className="text-black">
                                                    {pkg.active ? "ON" : "OFF"}
                                                </Label>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="4" className="text-center border font-semibold border-blue-600">
                                    No packages available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default AddPackage
