"use client"
import { ArrowLeftIcon, Trash2 } from 'lucide-react';
import React from 'react'

import { useState } from 'react';
import { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import toast from "react-hot-toast"
import { useRouter } from 'next/navigation';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  PilcrowSquare,
} from 'lucide-react'
const initialCreateTags = [''];
const initialHighlights = [{ title: '', point: '' }];
const createEmptyParagraphSection = () => ({
  title: '',
  description: '',
  firstImage: { url: '', key: '' },
  secondImage: { url: '', key: '' },
  bulletPoints: ['']
});
const initialParagraphSections = [createEmptyParagraphSection()];
const initialTableRows = [{ column1: '', column2: '' }];
const initialAccordionTags = [{ left: '', right: '' }];
const TEMPLATE_OPTIONS = [
  { value: 'design1', label: 'Design 1' },
  { value: 'design2', label: 'Design 2' },
  { value: 'design3', label: 'Design 3' },
];

const normalizeParagraphSections = (sections) => {
  if (!Array.isArray(sections) || sections.length === 0) {
    return initialParagraphSections;
  }
  return sections.map((section) => ({
    title: section?.title || '',
    description: section?.description || '',
    firstImage: section?.firstImage || { url: '', key: '' },
    secondImage: section?.secondImage || { url: '', key: '' },
    bulletPoints: Array.isArray(section?.bulletPoints) && section.bulletPoints.length > 0 ? section.bulletPoints : ['']
  }));
};

const InlineRichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontFamily, Typography, TextAlign, Underline, Link, Color, ListItem],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'min-h-[80px] border rounded-lg p-2 bg-gray-200 text-black font-semibold [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-1 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-500 [&_blockquote]:pl-3 [&_blockquote]:italic',
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 pb-2 mb-2 bg-white rounded-t px-2 pt-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}><UnderlineIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}><PilcrowSquare className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}><Heading1 className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}><Heading2 className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}><Heading3 className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}><Quote className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-1 rounded hover:bg-gray-100"><Undo className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-1 rounded hover:bg-gray-100"><Redo className="w-4 h-4" /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const EditWebpages = ({ activityId }) => {
  const router = useRouter();
  const imageFirstInputRef = useRef(null);
  const bannerImageInputRef = useRef(null);

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch webpage data on mount
  React.useEffect(() => {
    if (!activityId) return;
    setLoading(true);
    fetch(`/api/create_webpage/${activityId}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          // Defensive: ensure all fields exist
          setForm(prev => ({
            ...prev,
            ...data,
            templateType: data.templateType || 'design1',
            imageFirst: data.imageFirst || { url: '', key: '' },
            bannerImage: data.bannerImage || { url: '', key: '' },
            mainProfileImage: data.mainProfileImage || { url: '', key: '' },
            paragraphFirstImage: data.paragraphFirstImage || { url: '', key: '' },
            paragraphSecondImage: data.paragraphSecondImage || { url: '', key: '' },
            advertisementImage: data.advertisementImage || { url: '', key: '' },
            imageGallery: Array.isArray(data.imageGallery) ? data.imageGallery : [],
            createTags: Array.isArray(data.createTags) && data.createTags.length > 0 ? data.createTags : initialCreateTags,
            postedBy: data.postedBy || { admin: false, user: false },
            highlights: Array.isArray(data.highlights) && data.highlights.length > 0 ? data.highlights : initialHighlights,
            paragraphSections: normalizeParagraphSections(data.paragraphSections),
            tableTitle: data.tableTitle || '',
            tableRows: Array.isArray(data.tableRows) && data.tableRows.length > 0 ? data.tableRows : initialTableRows,
            blockquoteMainTitle: data.blockquoteMainTitle || '',
            blockquoteLeftTitle: data.blockquoteLeftTitle || '',
            blockquoteDescription: data.blockquoteDescription || '',
            blockquoteTags: Array.isArray(data.blockquoteTags) && data.blockquoteTags.length > 0 ? data.blockquoteTags : initialCreateTags,
            accordionTags: Array.isArray(data.accordionTags) && data.accordionTags.length > 0 ? data.accordionTags : initialAccordionTags,
            advertisementUrl: data.advertisementUrl || '',
            sideThumbImage: typeof data.sideThumbImage === 'string' ? data.sideThumbImage : data.sideThumbImage?.url || '',
            sideThumbImageKey: data.sideThumbImageKey || (typeof data.sideThumbImage === 'object' ? data.sideThumbImage?.key || '' : ''),
            sideThumbName: data.sideThumbName || '',
            sideThumbDesignation: data.sideThumbDesignation || '',
            sideThumbDescription: data.sideThumbDescription || '',
            facebookUrl: data.facebookUrl || '',
            youtubeUrl: data.youtubeUrl || '',
            instaUrl: data.instaUrl || '',
            googleUrl: data.googleUrl || ''
          }));
        } else {
          setError(data.error || 'Could not load webpage');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch webpage: ' + err.message);
        setLoading(false);
      });
  }, [activityId]);

  const [uploadingImageFirst, setUploadingImageFirst] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const galleryInputRef = useRef(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const mainProfileImageInputRef = useRef(null);
  const [uploadingMainProfileImage, setUploadingMainProfileImage] = useState(false);
  const sideThumbImageInputRef = useRef(null);
  const [uploadingSideThumbImage, setUploadingSideThumbImage] = useState(false);
  const advertisementImageInputRef = useRef(null);
  const [uploadingParagraphFirstImage, setUploadingParagraphFirstImage] = useState(false);
  const [uploadingParagraphSecondImage, setUploadingParagraphSecondImage] = useState(false);
  const [uploadingAdvertisementImage, setUploadingAdvertisementImage] = useState(false);
  const handleCloudinaryImageChange = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    if (key === 'imageFirst') setUploadingImageFirst(true);
    if (key === 'bannerImage') setUploadingBannerImage(true);
    if (key === 'mainProfileImage') setUploadingMainProfileImage(true);
    if (key === 'sideThumbImage') setUploadingSideThumbImage(true);
    if (key === 'paragraphFirstImage') setUploadingParagraphFirstImage(true);
    if (key === 'paragraphSecondImage') setUploadingParagraphSecondImage(true);
    if (key === 'advertisementImage') setUploadingAdvertisementImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formDataUpload
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm(prev => ({
          ...prev,
          ...(key === 'sideThumbImage'
            ? {
              sideThumbImage: data.url,
              sideThumbImageKey: data.key || ''
            }
            : {
              [key]: { url: data.url, key: data.key || '' }
            })
        }));
        toast.success('Image uploaded!');
      } else {
        toast.error('Cloudinary upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Cloudinary upload error: ' + err.message);
    }
    if (key === 'imageFirst') setUploadingImageFirst(false);
    if (key === 'bannerImage') setUploadingBannerImage(false);
    if (key === 'mainProfileImage') setUploadingMainProfileImage(false);
    if (key === 'sideThumbImage') setUploadingSideThumbImage(false);
    if (key === 'paragraphFirstImage') setUploadingParagraphFirstImage(false);
    if (key === 'paragraphSecondImage') setUploadingParagraphSecondImage(false);
    if (key === 'advertisementImage') setUploadingAdvertisementImage(false);
  };
  const handleDeleteCloudinaryImage = async (key) => {
    if (key === 'sideThumbImage') {
      const sideThumbImageKey = form.sideThumbImageKey;
      if (!sideThumbImageKey) {
        setForm(prev => ({ ...prev, sideThumbImage: '', sideThumbImageKey: '' }));
        return;
      }
      try {
        const res = await fetch('/api/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: sideThumbImageKey }),
        });
        const data = await res.json();
        if (res.ok) {
          setForm(prev => ({ ...prev, sideThumbImage: '', sideThumbImageKey: '' }));
          toast.success('Image deleted from Cloudinary!');
        } else {
          toast.error('Cloudinary delete failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        toast.error('Cloudinary delete error: ' + err.message);
      }
      return;
    }

    const image = form[key];
    if (!image || !image.key) {
      setForm(prev => ({ ...prev, [key]: { url: '', key: '' } }));
      return;
    }
    try {
      const res = await fetch('/api/cloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: image.key }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => ({ ...prev, [key]: { url: '', key: '' } }));
        toast.success('Image deleted from Cloudinary!');
      } else {
        toast.error('Cloudinary delete failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Cloudinary delete error: ' + err.message);
    }
  };

  const handleParagraphSectionImageChange = async (e, index, imageKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imageKey === 'firstImage') setUploadingParagraphFirstImage(true);
    if (imageKey === 'secondImage') setUploadingParagraphSecondImage(true);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const uploadedImage = { url: data.url, key: data.key || '' };
        setForm((prev) => {
          const nextParagraphs = [...(prev.paragraphSections || [])];
          nextParagraphs[index] = {
            ...nextParagraphs[index],
            [imageKey]: uploadedImage,
          };
          const next = { ...prev, paragraphSections: nextParagraphs };
          if (index === 0 && imageKey === 'firstImage') next.paragraphFirstImage = uploadedImage;
          if (index === 0 && imageKey === 'secondImage') next.paragraphSecondImage = uploadedImage;
          return next;
        });
        toast.success('Image uploaded!');
      } else {
        toast.error('Cloudinary upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Cloudinary upload error: ' + err.message);
    }

    if (imageKey === 'firstImage') setUploadingParagraphFirstImage(false);
    if (imageKey === 'secondImage') setUploadingParagraphSecondImage(false);
    e.target.value = '';
  };

  const handleDeleteParagraphSectionImage = async (index, imageKey) => {
    const image = form.paragraphSections?.[index]?.[imageKey];

    if (!image || !image.key) {
      setForm((prev) => {
        const nextParagraphs = [...(prev.paragraphSections || [])];
        nextParagraphs[index] = {
          ...nextParagraphs[index],
          [imageKey]: { url: '', key: '' },
        };
        const next = { ...prev, paragraphSections: nextParagraphs };
        if (index === 0 && imageKey === 'firstImage') next.paragraphFirstImage = { url: '', key: '' };
        if (index === 0 && imageKey === 'secondImage') next.paragraphSecondImage = { url: '', key: '' };
        return next;
      });
      return;
    }

    try {
      const res = await fetch('/api/cloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: image.key }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => {
          const nextParagraphs = [...(prev.paragraphSections || [])];
          nextParagraphs[index] = {
            ...nextParagraphs[index],
            [imageKey]: { url: '', key: '' },
          };
          const next = { ...prev, paragraphSections: nextParagraphs };
          if (index === 0 && imageKey === 'firstImage') next.paragraphFirstImage = { url: '', key: '' };
          if (index === 0 && imageKey === 'secondImage') next.paragraphSecondImage = { url: '', key: '' };
          return next;
        });
        toast.success('Image deleted from Cloudinary!');
      } else {
        toast.error('Cloudinary delete failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Cloudinary delete error: ' + err.message);
    }
  };
  const initialForm = {
    firstTitle: '',
    imageFirst: { url: '', key: '' },
    bannerImage: { url: '', key: '' },
    secondTitle: '',
    createTags: initialCreateTags,
    postedBy: { admin: false, user: false },
    highlights: initialHighlights,
    paragraphSections: initialParagraphSections,
    paragraphFirstImage: { url: '', key: '' },
    paragraphSecondImage: { url: '', key: '' },
    advertisementImage: { url: '', key: '' },
    advertisementUrl: '',
    tableTitle: '',
    tableRows: initialTableRows,
    blockquoteMainTitle: '',
    blockquoteLeftTitle: '',
    blockquoteDescription: '',
    blockquoteTags: initialCreateTags,
    accordionTags: initialAccordionTags,
    sideThumbImage: '',
    sideThumbImageKey: '',
    sideThumbName: '',
    sideThumbDesignation: '',
    sideThumbDescription: '',
    facebookUrl: '',
    youtubeUrl: '',
    instaUrl: '',
    googleUrl: '',
    mainProfileImage: { url: '', key: '' },
    imageGallery: [],
    active: true,
    templateType: 'design1'
  };
  const [form, setForm] = useState(initialForm);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const isDesignThree = form.templateType === 'design3';
  const isDesignOneOrTwo = form.templateType === 'design1' || form.templateType === 'design2';
  const [topSectionView, setTopSectionView] = useState('all');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handlePostedByChange = (key) => {
    setForm((prev) => ({
      ...prev,
      postedBy: {
        ...prev.postedBy,
        [key]: !prev.postedBy?.[key],
      },
    }));
  };

  const handleArrayTextChange = (name, index, value) => {
    setForm((prev) => {
      const next = [...(prev[name] || [])];
      next[index] = value;
      return { ...prev, [name]: next };
    });
  };

  const addArrayTextRow = (name) => {
    setForm((prev) => ({ ...prev, [name]: [...(prev[name] || []), ''] }));
  };

  const removeArrayTextRow = (name, index) => {
    setForm((prev) => ({ ...prev, [name]: (prev[name] || []).filter((_, i) => i !== index) }));
  };

  const handleObjectArrayChange = (name, index, key, value) => {
    setForm((prev) => {
      const next = [...(prev[name] || [])];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, [name]: next };
    });
  };

  const addObjectArrayRow = (name, newRow) => {
    setForm((prev) => ({ ...prev, [name]: [...(prev[name] || []), newRow] }));
  };

  const removeObjectArrayRow = (name, index) => {
    setForm((prev) => ({ ...prev, [name]: (prev[name] || []).filter((_, i) => i !== index) }));
  };

  const addParagraphBulletPoint = (paragraphIndex) => {
    setForm((prev) => {
      const nextParagraphs = [...(prev.paragraphSections || [])];
      const currentBullets = nextParagraphs[paragraphIndex]?.bulletPoints || [''];
      nextParagraphs[paragraphIndex] = {
        ...nextParagraphs[paragraphIndex],
        bulletPoints: [...currentBullets, ''],
      };
      return { ...prev, paragraphSections: nextParagraphs };
    });
  };

  const removeParagraphBulletPoint = (paragraphIndex, bulletIndex) => {
    setForm((prev) => {
      const nextParagraphs = [...(prev.paragraphSections || [])];
      const currentBullets = nextParagraphs[paragraphIndex]?.bulletPoints || [''];
      const updatedBullets = currentBullets.filter((_, idx) => idx !== bulletIndex);
      nextParagraphs[paragraphIndex] = {
        ...nextParagraphs[paragraphIndex],
        bulletPoints: updatedBullets.length > 0 ? updatedBullets : [''],
      };
      return { ...prev, paragraphSections: nextParagraphs };
    });
  };

  const handleParagraphBulletPointChange = (paragraphIndex, bulletIndex, value) => {
    setForm((prev) => {
      const nextParagraphs = [...(prev.paragraphSections || [])];
      const currentBullets = [...(nextParagraphs[paragraphIndex]?.bulletPoints || [''])];
      currentBullets[bulletIndex] = value;
      nextParagraphs[paragraphIndex] = {
        ...nextParagraphs[paragraphIndex],
        bulletPoints: currentBullets,
      };
      return { ...prev, paragraphSections: nextParagraphs };
    });
  };

  const hasNonEmptyText = (value) => typeof value === 'string' && value.trim().length > 0;
  const hasAnyNonEmptyTag = (tags) => Array.isArray(tags) && tags.some((tag) => hasNonEmptyText(tag));
  const hasPostedBySelection = (postedBy) => !!(postedBy?.admin || postedBy?.user);

  const hasTopTextSectionContent = (data) => {
    return (
      hasNonEmptyText(data?.firstTitle) ||
      hasNonEmptyText(data?.secondTitle) ||
      hasAnyNonEmptyTag(data?.createTags) ||
      hasPostedBySelection(data?.postedBy) ||
      !!data?.imageFirst?.url
    );
  };

  const hasTopBannerContent = (data) => !!data?.bannerImage?.url;

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { _id, __v, createdAt, updatedAt, ...restPayload } = form;
      const payload = { ...restPayload };
      const firstParagraphSection = Array.isArray(payload.paragraphSections) && payload.paragraphSections.length > 0
        ? payload.paragraphSections[0]
        : null;
      if (firstParagraphSection) {
        payload.paragraphFirstImage = firstParagraphSection.firstImage || { url: '', key: '' };
        payload.paragraphSecondImage = firstParagraphSection.secondImage || { url: '', key: '' };
      }

      const hasTopText = hasTopTextSectionContent(payload);
      const hasTopBanner = hasTopBannerContent(payload);
      if (hasTopText && hasTopBanner) {
        toast.error('Please fill either top text section or top banner image, not both.');
        return;
      }
      if (!hasTopText && !hasTopBanner) {
        toast.error('Please fill at least one option: top text section or top banner image.');
        return;
      }

      const res = await fetch(`/api/create_webpage/${activityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('webpage updated successfully!');
        // Refetch webpage data so form stays in sync
        fetch(`/api/create_webpage/${activityId}`)
          .then(res => res.json())
          .then(data => {
            if (data && !data.error) {
              setForm(prev => ({
                ...prev,
                ...data,
                templateType: data.templateType || 'design1',
                imageFirst: data.imageFirst || { url: '', key: '' },
                bannerImage: data.bannerImage || { url: '', key: '' },
                mainProfileImage: data.mainProfileImage || { url: '', key: '' },
                paragraphFirstImage: data.paragraphFirstImage || { url: '', key: '' },
                paragraphSecondImage: data.paragraphSecondImage || { url: '', key: '' },
                advertisementImage: data.advertisementImage || { url: '', key: '' },
                imageGallery: Array.isArray(data.imageGallery) ? data.imageGallery : [],
                createTags: Array.isArray(data.createTags) && data.createTags.length > 0 ? data.createTags : initialCreateTags,
                postedBy: data.postedBy || { admin: false, user: false },
                highlights: Array.isArray(data.highlights) && data.highlights.length > 0 ? data.highlights : initialHighlights,
                paragraphSections: normalizeParagraphSections(data.paragraphSections),
                tableTitle: data.tableTitle || '',
                tableRows: Array.isArray(data.tableRows) && data.tableRows.length > 0 ? data.tableRows : initialTableRows,
                blockquoteMainTitle: data.blockquoteMainTitle || '',
                blockquoteLeftTitle: data.blockquoteLeftTitle || '',
                blockquoteDescription: data.blockquoteDescription || '',
                blockquoteTags: Array.isArray(data.blockquoteTags) && data.blockquoteTags.length > 0 ? data.blockquoteTags : initialCreateTags,
                accordionTags: Array.isArray(data.accordionTags) && data.accordionTags.length > 0 ? data.accordionTags : initialAccordionTags,
                advertisementUrl: data.advertisementUrl || '',
                sideThumbImage: typeof data.sideThumbImage === 'string' ? data.sideThumbImage : data.sideThumbImage?.url || '',
                sideThumbImageKey: data.sideThumbImageKey || (typeof data.sideThumbImage === 'object' ? data.sideThumbImage?.key || '' : ''),
                sideThumbName: data.sideThumbName || '',
                sideThumbDesignation: data.sideThumbDesignation || '',
                sideThumbDescription: data.sideThumbDescription || '',
                facebookUrl: data.facebookUrl || '',
                youtubeUrl: data.youtubeUrl || '',
                instaUrl: data.instaUrl || '',
                googleUrl: data.googleUrl || ''
              }));
            }
          });
      } else {
        toast.error(data.error || 'Failed to update webpage');
      }
    } catch (err) {
      toast.error('Failed to update webpage: ' + err.message);
    }
  };
  return (
    <>
      <div className="w-full max-w-[1400px] mx-auto p-6 font-sans mt-4">
        <div className="mb-6">
          <button className='px-4 py-2 bg-white text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 shadow-sm rounded-xl flex items-center transition-all' onClick={() => {
            toast.dismiss();
            router.back()
          }}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to View Webpages
          </button>
        </div>
        <form className="max-w-4xl w-full mx-auto bg-white p-8 md:p-10 shadow-sm border border-slate-100 rounded-[20px]" onSubmit={handleSubmit}>
          <div className="border-b border-slate-100 pb-6 mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Edit Webpage: <span className="text-blue-600">{form.title}</span></h2>
            <p className="text-sm text-slate-500 mt-1">Update the content and configuration for this webpage.</p>
          </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Frontend Design</label>

          <input type="text" value={form.templateType} disabled readOnly className="w-full rounded-md p-3 bg-gray-200 font-semibold text-black" />
        </div>
        {(isDesignOneOrTwo || isDesignThree) && (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Top Section View</label>
              <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTopSectionView('all')}
                  className={`px-4 py-2 font-semibold ${topSectionView === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  All Inputs
                </button>
                <button
                  type="button"
                  onClick={() => setTopSectionView('bannerOnly')}
                  className={`px-4 py-2 font-semibold ${topSectionView === 'bannerOnly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  Banner Image Only
                </button>
              </div>
            </div>

            {topSectionView === 'all' && (
              <>
                {/* Main Short Tag Line */}
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Main Short Tag Line</label>
                  <input type="text" name="firstTitle" value={form.firstTitle} onChange={handleChange} placeholder="Type Here" className="w-full rounded-md p-3 bg-gray-200 font-semibold text-black" />
                </div>
                {/* Main Top Image (Cloudinary Upload) */}
                {!isDesignThree && (
                  <div className="mb-4">
                    <label className="block mb-1 font-semibold">Main Top Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleCloudinaryImageChange(e, 'imageFirst')}
                      ref={imageFirstInputRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className="mb-2 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => imageFirstInputRef.current && imageFirstInputRef.current.click()}
                    >
                      <span>Upload Here</span>
                    </button>
                    {uploadingImageFirst && <div className="text-blue-600 font-semibold">Uploading...</div>}
                    {form.imageFirst && form.imageFirst.url && (
                      <div className="relative w-full h-48 border rounded overflow-hidden mb-2">
                        <img
                          src={form.imageFirst.url}
                          alt="Image First Preview"
                          className="object-contain w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteCloudinaryImage('imageFirst')}
                          className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-200"
                          title="Remove image"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* Main Top Title Tag Line */}
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Main Top Title Tag Line</label>
                  <input type="text" name="secondTitle" value={form.secondTitle} onChange={handleChange} placeholder="Type Here" className="w-full rounded-md p-3 bg-gray-200 font-semibold" />
                </div>

                {/* Create Tag */}
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Create Tag</label>
                  {form.createTags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleArrayTextChange('createTags', index, e.target.value)}
                        placeholder="Type Here"
                        className="flex-1 rounded-md p-3 bg-gray-200 font-semibold"
                      />
                      <button type="button" onClick={() => addArrayTextRow('createTags')} className="bg-blue-700 text-white px-3 py-2 rounded">+</button>
                      {form.createTags.length > 1 && (
                        <button type="button" onClick={() => removeArrayTextRow('createTags', index)} className="bg-red-500 text-white px-3 py-2 rounded"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Posted By */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Posted By</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 font-semibold">
                      <input type="checkbox" checked={!!form.postedBy?.admin} onChange={() => handlePostedByChange('admin')} /> Admin
                    </label>
                    <label className="flex items-center gap-2 font-semibold">
                      <input type="checkbox" checked={!!form.postedBy?.user} onChange={() => handlePostedByChange('user')} /> User
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Main Top Banner Image (Cloudinary Upload) */}
            {(topSectionView === 'bannerOnly') && (
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Main Top Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleCloudinaryImageChange(e, 'bannerImage')}
                  ref={bannerImageInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  className="mb-2 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => bannerImageInputRef.current && bannerImageInputRef.current.click()}
                >
                  <span>Upload Here</span>
                </button>
                {uploadingBannerImage && <div className="text-blue-600 font-semibold">Uploading...</div>}
                {form.bannerImage && form.bannerImage.url && (
                  <div className="relative w-full h-48 border rounded overflow-hidden mb-2">
                    <img
                      src={form.bannerImage.url}
                      alt="Banner Image Preview"
                      className="object-contain w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteCloudinaryImage('bannerImage')}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-200"
                      title="Remove image"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            )}


            {/* Highlights */}
            <div className="mb-4 border rounded p-3 bg-blue-50">
              <label className="block mb-2 font-semibold">Highlights</label>
              {form.highlights.map((row, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                  <input
                    type="text"
                    value={row.title}
                    onChange={(e) => handleObjectArrayChange('highlights', index, 'title', e.target.value)}
                    placeholder="Highlight Title"
                    className="rounded-md p-3 bg-gray-200 font-semibold"
                  />
                  <input
                    type="text"
                    value={row.point}
                    onChange={(e) => handleObjectArrayChange('highlights', index, 'point', e.target.value)}
                    placeholder="Point"
                    className="rounded-md p-3 bg-gray-200 font-semibold"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => addObjectArrayRow('highlights', { title: '', point: '' })} className="bg-blue-700 text-white px-3 py-2 rounded">+</button>
                    {form.highlights.length > 1 && (
                      <button type="button" onClick={() => removeObjectArrayRow('highlights', index)} className="bg-red-500 text-white px-3 py-2 rounded"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Paragraph Section */}
            <div className="mb-4 border rounded p-3 bg-gray-50">
              <label className="block mb-2 font-semibold">Paragraph Section</label>
              {form.paragraphSections.map((row, index) => (
                <div key={index} className="mb-3 border border-gray-200 rounded p-3">
                  <label className="block mb-2 font-semibold">Paragraph Heading</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) => handleObjectArrayChange('paragraphSections', index, 'title', e.target.value)}
                      placeholder="Title Text Line"
                      className="flex-1 rounded-md p-3 bg-gray-200 font-semibold"
                    />
                    <button type="button" onClick={() => addObjectArrayRow('paragraphSections', createEmptyParagraphSection())} className="bg-blue-700 text-white px-3 py-2 rounded">+</button>
                    {form.paragraphSections.length > 1 && (
                      <button type="button" onClick={() => removeObjectArrayRow('paragraphSections', index)} className="bg-red-500 text-white px-3 py-2 rounded"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                  <label className="block mb-2 font-semibold my-5">Paragraph Description</label>
                  <InlineRichTextEditor
                    value={row.description}
                    onChange={(html) => handleObjectArrayChange('paragraphSections', index, 'description', html)}
                  />
                  <div className="flex flex-col gap-3 mt-2">
                    <div>
                      <input id={`paragraph-first-image-${index}`} type="file" accept="image/*" onChange={e => handleParagraphSectionImageChange(e, index, 'firstImage')} className="hidden" />
                      <label htmlFor={`paragraph-first-image-${index}`} className="inline-block bg-yellow-400 my-2 px-4 py-2 rounded cursor-pointer">Upload First Image</label>
                      {uploadingParagraphFirstImage && <div className="text-blue-600 text-sm my-2">Uploading...</div>}
                      {row.firstImage?.url && (
                        <div className="relative w-full h-48 border rounded overflow-hidden mb-2">
                          <img
                            src={row.firstImage.url}
                            alt="Paragraph First Image Preview"
                            className="object-contain w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteParagraphSectionImage(index, 'firstImage')}
                            className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-200"
                            title="Remove image"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <input id={`paragraph-second-image-${index}`} type="file" accept="image/*" onChange={e => handleParagraphSectionImageChange(e, index, 'secondImage')} className="hidden" />
                      <label htmlFor={`paragraph-second-image-${index}`} className="inline-block bg-gray-200 px-4 py-2 rounded cursor-pointer">Upload Second Image</label>
                      {uploadingParagraphSecondImage && <div className="text-blue-600 text-sm my-2">Uploading...</div>}
                      {row.secondImage?.url && (
                        <div className="relative w-full h-48 border rounded overflow-hidden mb-2">
                          <img
                            src={row.secondImage.url}
                            alt="Paragraph Second Image Preview"
                            className="object-contain w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteParagraphSectionImage(index, 'secondImage')}
                            className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-200"
                            title="Remove image"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded p-3 bg-white">
                      <label className="block mb-2 font-semibold">Bullet Points</label>
                      {(row.bulletPoints || ['']).map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => handleParagraphBulletPointChange(index, bulletIndex, e.target.value)}
                            placeholder="Add bullet point"
                            className="flex-1 rounded-md p-3 bg-gray-200 font-semibold"
                          />
                          <button type="button" onClick={() => addParagraphBulletPoint(index)} className="bg-blue-700 text-white px-3 py-2 rounded">+</button>
                          {(row.bulletPoints || []).length > 1 && (
                            <button type="button" onClick={() => removeParagraphBulletPoint(index, bulletIndex)} className="bg-red-500 text-white px-3 py-2 rounded"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Data */}
            <label className="block mb-2 font-semibold">Table Data</label>
            <div className="mb-4 border rounded p-3 bg-blue-50">
              <label className="block mb-2 font-semibold">Table Heading</label>
              <input
                type="text"
                name="tableTitle"
                value={form.tableTitle}
                onChange={handleChange}
                placeholder="Table Title"
                className="w-full rounded-md p-3 bg-gray-200 font-semibold mb-2"
              />
              <label className="block mb-2 font-semibold">Table Description</label>

              {form.tableRows.map((row, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 mb-2">

                  <input type="text" value={row.column1} onChange={(e) => handleObjectArrayChange('tableRows', index, 'column1', e.target.value)} placeholder="Column 1" className="rounded-md p-3 bg-gray-200 font-semibold" />
                  <input type="text" value={row.column2} onChange={(e) => handleObjectArrayChange('tableRows', index, 'column2', e.target.value)} placeholder="Column 2" className="rounded-md p-3 bg-gray-200 font-semibold" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => addObjectArrayRow('tableRows', { column1: '', column2: '' })} className="bg-blue-700 text-white px-3 py-2 rounded">+</button>
                    {form.tableRows.length > 1 && (
                      <button type="button" onClick={() => removeObjectArrayRow('tableRows', index)} className="bg-red-500 text-white px-3 py-2 rounded"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Blockquote */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Blockquote Title</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <input type="text" name="blockquoteMainTitle" value={form.blockquoteMainTitle} onChange={handleChange} placeholder="Title Name For Blockquote" className="rounded-md p-3 bg-gray-200 font-semibold" />
                <input type="text" name="blockquoteLeftTitle" value={form.blockquoteLeftTitle} onChange={handleChange} placeholder="Blockquote Left Para" className="rounded-md p-3 bg-gray-200 font-semibold" />
              </div>
              <label className="block mb-2 font-semibold">BlockQoute Description</label>
              <InlineRichTextEditor
                value={form.blockquoteDescription}
                onChange={(html) => setForm((prev) => ({ ...prev, blockquoteDescription: html }))}
              />
              <div className="mt-2">
                <label className="block mb-2 font-semibold">Blockquote Tags</label>
                {form.blockquoteTags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input type="text" value={tag} onChange={(e) => handleArrayTextChange('blockquoteTags', index, e.target.value)} placeholder="Blockquote Tag" className="flex-1 rounded-md p-3 bg-gray-200 font-semibold" />
                    <button type="button" onClick={() => addArrayTextRow('blockquoteTags')} className="bg-blue-700 text-white px-3 py-2 rounded">+</button>
                    {form.blockquoteTags.length > 1 && (
                      <button type="button" onClick={() => removeArrayTextRow('blockquoteTags', index)} className="bg-red-500 text-white px-3 py-2 rounded"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Accordion Tag */}
            {!isDesignThree && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Advertisement Section</label>
                <div className="flex flex-col gap-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleCloudinaryImageChange(e, 'advertisementImage')}
                      ref={advertisementImageInputRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => advertisementImageInputRef.current && advertisementImageInputRef.current.click()}
                      className="rounded-md p-3 bg-blue-400 font-semibold text-left"
                    >
                      {form.advertisementImage?.url ? 'Change Advertisement Image' : 'Upload Advertisement Image'}
                    </button>
                    {uploadingAdvertisementImage && <div className="text-blue-600 text-sm mt-1">Uploading...</div>}
                    {form.advertisementImage?.url && (
                      <div className="relative w-full h-48 border rounded overflow-hidden mt-2">
                        <img src={form.advertisementImage.url} alt="Advertisement Preview" className="object-contain w-full h-full" />
                        <button
                          type="button"
                          onClick={() => handleDeleteCloudinaryImage('advertisementImage')}
                          className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-200"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className='font-semibold mb-1'>Advertisement URL</h2>
                    <input
                      type="text"
                      name="advertisementUrl"
                      value={form.advertisementUrl}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="rounded-md p-3 bg-gray-200 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {!isDesignThree && (
              <div className="mb-4">
                <label className="block mb-2 font-bold">Accordion Tag</label>
                {form.accordionTags.map((row, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                    <div className="flex flex-col gap-1">
                      <label className="block mb-2 font-semibold text-sm">Accordion Main Title</label>
                      <input type="text" value={row.left} onChange={(e) => handleObjectArrayChange('accordionTags', index, 'left', e.target.value)} placeholder="Title Text Line" className="rounded-md p-3 bg-gray-200 font-semibold" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="block mb-2 font-semibold text-sm">Accordion Description</label>
                      <input type="text" value={row.right} onChange={(e) => handleObjectArrayChange('accordionTags', index, 'right', e.target.value)} placeholder="Accordion Tag Line" className="rounded-md p-3 bg-gray-200 font-semibold" />
                    </div>
                    <div className="flex items-end gap-2">
                      <button type="button" onClick={() => addObjectArrayRow('accordionTags', { left: '', right: '' })} className="bg-blue-700 text-white px-3 py-2 rounded">+</button>
                      {form.accordionTags.length > 1 && (
                        <button type="button" onClick={() => removeObjectArrayRow('accordionTags', index)} className="bg-red-500 text-white px-3 py-2 rounded"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Side Thumb Blog */}
            {!isDesignThree && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Side Thumb Blog</label>
                <div className="flex flex-col gap-5 mb-2">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleCloudinaryImageChange(e, 'sideThumbImage')}
                      ref={sideThumbImageInputRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => sideThumbImageInputRef.current && sideThumbImageInputRef.current.click()}
                      className="rounded-md p-3 bg-blue-400 font-semibold text-left"
                    >
                      {form.sideThumbImage ? 'Change Thumb Image' : 'Upload Thumb Image'}
                    </button>
                    {uploadingSideThumbImage && <div className="text-blue-600 text-sm mt-1">Uploading...</div>}
                    {form.sideThumbImage && (
                      <div className="relative w-full h-48 border rounded overflow-hidden mt-2">
                        <img src={form.sideThumbImage} alt="Side Thumb Preview" className="object-contain w-full h-full" />
                        <button
                          type="button"
                          onClick={() => handleDeleteCloudinaryImage('sideThumbImage')}
                          className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-200"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col  gap-2">
                    <h2 className='font-semibold mb-2'>Side Thumb Name</h2>
                    <input type="text" name="sideThumbName" value={form.sideThumbName} onChange={handleChange} placeholder="Name Here" className="rounded-md p-3 bg-gray-200 text-black font-semibold" />
                    <h2 className='font-semibold mb-2'>Side Thumb Designation</h2>
                    <input type="text" name="sideThumbDesignation" value={form.sideThumbDesignation} onChange={handleChange} placeholder="Designation" className="rounded-md p-3 bg-gray-200 text-black font-semibold" />
                    <h2 className='font-semibold mb-2'>Side Thumb Description</h2>
                    <input type="text" name="sideThumbDescription" value={form.sideThumbDescription} onChange={handleChange} placeholder="Description" className="rounded-md p-3 bg-gray-200 text-black font-semibold" />
                  </div>
                </div>
                <hr className='my-4 border-black' />
                <h2 className="text-lg font-bold my-2">Social Media Links</h2>
                <div className="grid grid-col-1 gap-2">
                  <h2 className='font-semibold mb-1'>Facebook URL</h2>
                  <input type="text" name="facebookUrl" value={form.facebookUrl} onChange={handleChange} placeholder="Facebook Url" className="rounded-md p-3 bg-gray-200 font-semibold" />
                  <h2 className='font-semibold mb-1'>Youtube URL</h2>
                  <input type="text" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} placeholder="Youtube Url" className="rounded-md p-3 bg-gray-200 font-semibold" />
                  <h2 className='font-semibold mb-1'>Instagram URL</h2>
                  <input type="text" name="instaUrl" value={form.instaUrl} onChange={handleChange} placeholder="Insta Url" className="rounded-md p-3 bg-gray-200 font-semibold" />
                  <h2 className='font-semibold mb-1'>Google URL</h2>
                  <input type="text" name="googleUrl" value={form.googleUrl} onChange={handleChange} placeholder="Google Url" className="rounded-md p-3 bg-gray-200 font-semibold" />
                </div>
              </div>
            )}


          </>
        )}
        {/* Data Save Button */}
        <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-sm transition-all text-lg">
            Save Changes
          </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default EditWebpages
