import { NextResponse } from 'next/server';
import connectDB  from '@/lib/connectDB';
import PropertyDetails from '@/models/Property/PropertyDetails';

export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();

        // Create new hostel registration
        const registration = new PropertyDetails(data);
        await registration.save();

        return NextResponse.json(
            { 
                success: true, 
                message: 'Property registration submitted successfully',
                data: {
                    caseIdNumber: registration.caseIdNumber || registration._id.toString().slice(-6).toUpperCase(),
                    propertyName: registration.propertyName,
                    contactNumber: registration.contactNumbers?.[0] || 'N/A'
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error submitting hostel registration:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to submit registration' },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        await connectDB();
        
        // Optionally handle URL parameters for filtering
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        
        let query = {};
        if (status && status !== 'All') {
            query.status = status;
        }

        const registrations = await PropertyDetails.find(query).sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, data: registrations },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching hostel registrations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch hostel registrations' },
            { status: 500 }
        );
    }
}


export async function PUT(req) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ success: false, error: 'Hostel ID is required' }, { status: 400 });
        }

        const data = await req.json();
        const { status } = data;

        if (!status) {
            return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
        }

        const updatedRegistration = await PropertyDetails.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRegistration) {
            return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
        }

        return NextResponse.json(
            { success: true, message: 'Status updated successfully', data: updatedRegistration },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating hostel registration:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update registration' },
            { status: 500 }
        );
    }
}
