"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";

const createSubSection = () => ({
  title: "",
  url: "",
  order: "",
  active: true,
});

const createFormState = () => ({
  title: "",
  url: "#",
  order: "",
  active: true,
  subSections: [createSubSection()],
});

const normalizeFormData = (formState, fallbackOrder = 1) => ({
  title: formState.title.trim(),
  url: formState.url?.trim() || "#",
  order: formState.order === "" ? fallbackOrder : Number(formState.order),
  active: formState.active,
  subSections: formState.subSections
    .filter((item) => item.title.trim())
    .map((item, index) => ({
      title: item.title.trim(),
      url: item.url?.trim() || "#",
      order: item.order === "" ? index + 1 : Number(item.order),
      active: item.active,
    })),
});

const NavbarSection = () => {
  const [sections, setSections] = useState([]);
  const [formState, setFormState] = useState(createFormState());
  const [editingId, setEditingId] = useState(null);

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/navbar-sections");
      const data = await response.json();
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      setSections([]);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const resetForm = () => {
    setFormState(createFormState());
    setEditingId(null);
  };

  const handleSubSectionChange = (index, key, value) => {
    setFormState((previous) => ({
      ...previous,
      subSections: previous.subSections.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addSubSection = () => {
    setFormState((previous) => ({
      ...previous,
      subSections: [...previous.subSections, createSubSection()],
    }));
  };

  const removeSubSection = (index) => {
    setFormState((previous) => ({
      ...previous,
      subSections: previous.subSections.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formState.title.trim()) {
      toast.error("Navbar section title is required");
      return;
    }

    const payload = normalizeFormData(formState, sections.length + 1);

    try {
      const response = await fetch("/api/navbar-sections", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save navbar section");
      }

      toast.success(editingId ? "Navbar section updated" : "Navbar section created");
      resetForm();
      await fetchSections();
      window.dispatchEvent(new Event("navbarSectionsUpdated"));
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleEdit = (section) => {
    setEditingId(section._id);
    setFormState({
      title: section.title || "",
      url: section.url || "#",
      order: section.order ?? "",
      active: section.active ?? true,
      subSections: Array.isArray(section.subSections) && section.subSections.length
        ? section.subSections.map((item) => ({
            title: item.title || "",
            url: item.url || "#",
            order: item.order ?? "",
            active: item.active ?? true,
          }))
        : [createSubSection()],
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/navbar-sections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete navbar section");
      }

      toast.success("Navbar section deleted");
      await fetchSections();
      window.dispatchEvent(new Event("navbarSectionsUpdated"));
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const toggleActive = async (section) => {
    try {
      const response = await fetch("/api/navbar-sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: section._id, active: !section.active }),
      });

      if (!response.ok) {
        throw new Error("Failed to update navbar section status");
      }

      await fetchSections();
      window.dispatchEvent(new Event("navbarSectionsUpdated"));
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const sortedSections = [...sections].sort((left, right) => (left.order || 0) - (right.order || 0));

  return (
    <div className="space-y-6 p-4 pt-0">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">Manage Navbar Section</h1>
          <p className="text-sm text-gray-600">Create top-level links and nested sub-sections for the header.</p>
        </div>
        {editingId ? (
          <Button type="button" variant="outline" onClick={resetForm} className="w-fit">
            Cancel edit
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={formState.title}
                onChange={(event) => setFormState((previous) => ({ ...previous, title: event.target.value }))}
                placeholder="About Us"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="url">Section URL</Label>
                <Input
                  id="url"
                  value={formState.url}
                  onChange={(event) => setFormState((previous) => ({ ...previous, url: event.target.value }))}
                  placeholder="/about-us"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formState.order}
                  onChange={(event) => setFormState((previous) => ({ ...previous, order: event.target.value }))}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3">
              <div>
                <Label className="text-sm font-medium">Active</Label>
                <p className="text-xs text-gray-500">Hide the section without deleting it.</p>
              </div>
              <Switch
                checked={formState.active}
                onCheckedChange={(checked) => setFormState((previous) => ({ ...previous, active: checked }))}
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-dashed p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Sub Sections</h2>
                  <p className="text-xs text-gray-500">Add one or more nested links under this section.</p>
                </div>
                <Button type="button" variant="outline" onClick={addSubSection} className="gap-2">
                  <Plus className="size-4" /> Add row
                </Button>
              </div>

              <div className="space-y-4">
                {formState.subSections.map((subSection, index) => (
                  <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Sub Section Title</Label>
                        <Input
                          value={subSection.title}
                          onChange={(event) => handleSubSectionChange(index, "title", event.target.value)}
                          placeholder="Vision and Mission"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Sub Section URL</Label>
                        <Input
                          value={subSection.url}
                          onChange={(event) => handleSubSectionChange(index, "url", event.target.value)}
                          placeholder="/vision-mission"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={subSection.order}
                          onChange={(event) => handleSubSectionChange(index, "order", event.target.value)}
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={subSection.active}
                          onCheckedChange={(checked) => handleSubSectionChange(index, "active", checked)}
                        />
                        <Label className="text-sm">Active</Label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeSubSection(index)}
                        disabled={formState.subSections.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingId ? "Update Navbar Section" : "Create Navbar Section"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Saved Sections</h2>
              <p className="text-sm text-gray-600">These entries are used in the site header.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Sub Sections</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSections.map((section) => (
                  <TableRow key={section._id}>
                    <TableCell className="font-medium">
                      <div>{section.title}</div>
                      <div className="text-xs text-gray-500">{section.url}</div>
                    </TableCell>
                    <TableCell>{section.subSections?.length || 0}</TableCell>
                    <TableCell>{section.order}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => toggleActive(section)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${section.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {section.active ? "Active" : "Hidden"}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" size="icon" variant="outline" onClick={() => handleEdit(section)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button type="button" size="icon" variant="destructive" onClick={() => handleDelete(section._id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarSection;import React from 'react'

