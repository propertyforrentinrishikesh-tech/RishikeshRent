import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function DeclarationForm({ formData, onSubmit, onCancel }) {
    const signatureRef = useRef(null);
    const [signatureImage, setSignatureImage] = useState({ url: '', key: '', loading: false });
    const [verificationDate, setVerificationDate] = useState(new Date().toLocaleDateString('en-IN'));

    // Clear signature
    const clearSignature = () => {
        signatureRef.current?.clear();
        setSignatureImage({ url: '', key: '', loading: false });
    };

    // Save signature to Cloudinary
    const saveSignature = async () => {
        if (signatureRef.current?.isEmpty()) {
            toast.error('Please provide your signature');
            return false;
        }

        setSignatureImage(prev => ({ ...prev, loading: true }));

        try {
            // Convert signature to blob
            const canvas = signatureRef.current.getCanvas();
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            // Upload to Cloudinary
            const formDataUpload = new FormData();
            formDataUpload.append('file', blob, 'signature.png');

            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();

            if (res.ok && data.url) {
                setSignatureImage({
                    url: data.url,
                    key: data.key || '',
                    loading: false
                });
                toast.success('Signature saved successfully!');
                return { url: data.url, key: data.key || '' };
            } else {
                console.error('Cloudinary upload failed:', data.error || 'Unknown error');
                setSignatureImage(prev => ({ ...prev, loading: false }));
                toast.error('Failed to save signature');
                return false;
            }
        } catch (err) {
            console.error('Signature upload error:', err.message);
            setSignatureImage(prev => ({ ...prev, loading: false }));
            toast.error('Failed to save signature');
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Save signature first
        const signatureData = await saveSignature();
        if (!signatureData) return;

        // Call parent submit with signature URL object
        onSubmit({
            signatureUrl: signatureData,
            verificationDate
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
                <h1 className="text-2xl font-bold uppercase">Self-Attestation & Declaration of Ownership</h1>
            </div>

            {/* To & Subject */}
            <div className="mb-6 space-y-2">
                <p className="text-sm">
                    <span className="font-semibold">To:</span> The Management/Admins of{' '}
                    <a href="https://www.rishikeshrent.com" className="text-blue-600 underline">
                        www.rishikeshrent.com
                    </a>
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Subject:</span> Declaration of Authorization for Listing Property for Rent
                </p>
            </div>

            {/* Declaration Text */}
            <div className="mb-6 space-y-4 text-sm leading-relaxed">
                <p>
                    I, <span className="font-semibold">[{formData.brokerName || formData.ownerName || 'Owner Full Name'}]</span>, son/daughter/wife of{' '}
                    <span className="font-semibold">[{formData.sonDaughterWifeOf || "Father/Husband's Name"}]</span>, currently residing at{' '}
                    <span className="font-semibold">[{formData.contactAddress || 'Your Full Permanent Address'}]</span>, do hereby solemnly affirm and declare as follows:
                </p>

                <div className="space-y-3 ml-4">
                    <div>
                        <p className="font-semibold">1. Ownership Status:</p>
                        <p className="ml-4">I am the lawful owner/authorized legal representative of the property located at:</p>
                        <ul className="ml-8 list-disc space-y-1 mt-2">
                            <li>
                                <span className="font-semibold">Full Property Address:</span> {formData.contactAddress || '[Insert Address of the Room/Premises being rented out]'}
                            </li>
                            <li>
                                <span className="font-semibold">Property Type:</span> {formData.propertyType || '[e.g., Single Room, 2BHK Flat, Commercial Space]'}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="font-semibold">2. Permission to List:</p>
                        <p className="ml-4">
                            I am voluntarily providing the aforementioned premises for rental purposes and have no objection to listing this property on the web portal{' '}
                            <a href="https://www.rishikeshrent.com" className="text-blue-600 underline">
                                www.rishikeshrent.com
                            </a>
                            .
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">3. Accuracy of Information:</p>
                        <p className="ml-4">
                            All details, photographs, and descriptions provided by me for the listing are true and accurate to the best of my knowledge.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">4. Legal Compliance:</p>
                        <p className="ml-4">
                            The premises are free from legal disputes or encumbrances that would prevent them from being rented out. I agree to abide by the local laws of Rishikesh/Uttarakhand regarding tenant verification and police registration.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">5. Indemnity:</p>
                        <p className="ml-4">
                            I understand that{' '}
                            <a href="https://www.rishikeshrent.com" className="text-blue-600 underline">
                                www.rishikeshrent.com
                            </a>{' '}
                            is a listing platform and I shall hold the platform harmless against any disputes arising from the tenancy or any incorrect information provided by me.
                        </p>
                    </div>
                </div>
            </div>

            {/* Property Owner Details */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Property Owner Details:</h3>
                <ul className="space-y-2 text-sm">
                    <li>
                        <span className="font-semibold">Aadhar Number:</span> {formData.aadharCardNumber || '________________'} (Attach a self-attested copy)
                    </li>
                    <li>
                        <span className="font-semibold">PAN Number:</span> {formData.panCardNumber || '________________'}
                    </li>
                    <li>
                        <span className="font-semibold">Contact Number:</span> {formData.contactNumbers?.[0] ? `+91 ${formData.contactNumbers[0]}` : '________________'}
                    </li>
                    <li>
                        <span className="font-semibold">Email Address:</span> {formData.emailAddresses?.[0] || '________________'}
                    </li>
                </ul>
            </div>

            {/* Verification */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Verification:</h3>
                <p className="text-sm">
                    Verified at <span className="font-semibold">Rishikesh</span> on this{' '}
                    <Input
                        type="text"
                        value={verificationDate}
                        onChange={(e) => setVerificationDate(e.target.value)}
                        className="inline-block w-48 mx-2"
                    />
                    , that the contents of this declaration are true and correct.
                </p>
            </div>

            {/* Digital Signature */}
            <div className="mb-6 border-2 border-gray-300 rounded-lg p-4">
                <Label className="font-semibold mb-2 block">Signature of Owner:</Label>

                {!signatureImage.url ? (
                    <div>
                        <div className="border-2 border-dashed border-gray-400 rounded-lg bg-gray-50">
                            <SignatureCanvas
                                ref={signatureRef}
                                canvasProps={{
                                    className: 'w-full h-48 cursor-crosshair'
                                }}
                                backgroundColor="rgb(249, 250, 251)"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={clearSignature}
                                className="flex-1"
                            >
                                Clear Signature
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Sign above using your mouse or touchscreen</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                            <Image
                                src={signatureImage.url}
                                alt="Signature"
                                width={400}
                                height={150}
                                className="mx-auto"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSignatureImage({ url: '', key: '', loading: false });
                                signatureRef.current?.clear();
                            }}
                            className="w-full"
                        >
                            Change Signature
                        </Button>
                    </div>
                )}

                <div className="mt-4">
                    <p className="text-sm">
                        <span className="font-semibold">(Full Name:</span> {formData.ownerName || formData.brokerName ||'______________________'})
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                    disabled={signatureImage.loading}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-lg py-6"
                    disabled={signatureImage.loading}
                >
                    {signatureImage.loading ? 'Saving Signature...' : 'Submit Declaration & Save Property'}
                </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded text-xs">
                <p className="font-semibold mb-1">Note:</p>
                <p>
                    After properly filling and self-attestation form from www.rishikeshrent.com have been successfully submitted. Your application is currently in the queue for verification. Our QC (Quality Control) Team is reviewing the documents and property details to ensure they meet our listing standards. You will receive a notification once your property is approved and live on the portal.
                </p>
            </div>
        </div>
    );
}
