import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PlanPricing from '@/models/PlanPricing';
import RatePlan from '@/models/RatePlan';
import PropertyRegistration from '@/models/PropertyRegistration';

// GET - Fetch plan pricing
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');
        const ratePlanId = searchParams.get('ratePlanId');
        const roomType = searchParams.get('roomType');
        const pricingId = searchParams.get('pricingId');

        if (!propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Property ID is required'
            }, { status: 400 });
        }

        // Single pricing query
        if (pricingId) {
            const pricing = await PlanPricing.findOne({ _id: pricingId, propertyId })
                .populate('ratePlanId')
                .lean();

            if (!pricing) {
                return NextResponse.json({
                    success: false,
                    message: 'Plan pricing not found'
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: pricing
            });
        }

        // Build query
        const query = { propertyId };
        if (ratePlanId) query.ratePlanId = ratePlanId;
        if (roomType) query.roomType = roomType;

        const pricing = await PlanPricing.find(query)
            .populate('ratePlanId')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            count: pricing.length,
            data: pricing
        });

    } catch (error) {
        console.error('Plan Pricing GET Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch plan pricing',
            error: error.message
        }, { status: 500 });
    }
}

// POST - Create plan pricing
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            propertyId,
            ratePlanId,
            roomType,
            planType,
            image,
            sideTagLine,
            description,
            requirement,
            epPlan,
            cpPlan,
            mapPlan,
            apPlan,
            isActive,
            notes,
            createdBy
        } = body;

        // Validation
        if (!propertyId || !ratePlanId || !roomType) {
            return NextResponse.json({
                success: false,
                message: 'Property ID, Rate Plan ID, and Room Type are required'
            }, { status: 400 });
        }

        // Verify property exists
        const property = await PropertyRegistration.findById(propertyId);
        if (!property) {
            return NextResponse.json({
                success: false,
                message: 'Property not found'
            }, { status: 404 });
        }

        // Verify rate plan exists and belongs to property
        // const ratePlan = await RatePlan.findOne({ _id: ratePlanId, propertyId });
        // if (!ratePlan) {
        //     return NextResponse.json({
        //         success: false,
        //         message: 'Rate plan not found or does not belong to this property'
        //     }, { status: 404 });
        // }

        // Verify room type exists in property
        const roomExists = property.rooms.some(room => room.roomType === roomType);
        if (!roomExists) {
            return NextResponse.json({
                success: false,
                message: 'Room type not found in property'
            }, { status: 404 });
        }

        // Check if pricing already exists for this combination
        const existingPricing = await PlanPricing.findOne({ propertyId, ratePlanId, roomType });
        if (existingPricing) {
            return NextResponse.json({
                success: false,
                message: 'Pricing already exists for this rate plan and room type combination'
            }, { status: 400 });
        }

        // Check if at least one pricing plan has values
        const hasEP = epPlan?.person1 || epPlan?.person2;
        const hasCP = cpPlan?.person1 || cpPlan?.person2;
        const hasMAP = mapPlan?.person1 || mapPlan?.person2;
        const hasAP = apPlan?.person1 || apPlan?.person2;

        if (!hasEP && !hasCP && !hasMAP && !hasAP) {
            return NextResponse.json({
                success: false,
                message: 'Please enter at least one pricing plan'
            }, { status: 400 });
        }

        // Create plan pricing
        const planPricing = await PlanPricing.create({
            propertyId,
            ratePlanId,
            roomType,
            image: image || { url: '', key: '' },
            sideTagLine: sideTagLine || '',
            description: description || '',
            requirement: requirement || '',
            epPlan: epPlan || { person1: 0, person2: 0 },
            cpPlan: cpPlan || { person1: 0, person2: 0 },
            mapPlan: mapPlan || { person1: 0, person2: 0 },
            apPlan: apPlan || { person1: 0, person2: 0 },
            isActive: isActive !== undefined ? isActive : true,
            notes: notes || '',
            createdBy: createdBy || propertyId,
            updatedBy: createdBy || propertyId
        });

        // Populate the rate plan details
        await planPricing.populate('ratePlanId');

        return NextResponse.json({
            success: true,
            message: 'Plan pricing created successfully',
            data: planPricing
        }, { status: 201 });

    } catch (error) {
        console.error('Plan Pricing POST Error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: 'Pricing already exists for this combination'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Failed to create plan pricing',
            error: error.message
        }, { status: 500 });
    }
}

// PUT - Update plan pricing
export async function PUT(request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            pricingId,
            propertyId,
            image,
            sideTagLine,
            description,
            requirement,
            epPlan,
            cpPlan,
            mapPlan,
            apPlan,
            isActive,
            notes,
            updatedBy
        } = body;

        // Validation
        if (!pricingId || !propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Pricing ID and Property ID are required'
            }, { status: 400 });
        }

        // Find the pricing
        const pricing = await PlanPricing.findOne({ _id: pricingId, propertyId });
        if (!pricing) {
            return NextResponse.json({
                success: false,
                message: 'Plan pricing not found'
            }, { status: 404 });
        }

        // Update fields
        if (image !== undefined) pricing.image = image;
        if (sideTagLine !== undefined) pricing.sideTagLine = sideTagLine;
        if (description !== undefined) pricing.description = description;
        if (requirement !== undefined) pricing.requirement = requirement;
        if (epPlan) pricing.epPlan = epPlan;
        if (cpPlan) pricing.cpPlan = cpPlan;
        if (mapPlan) pricing.mapPlan = mapPlan;
        if (apPlan) pricing.apPlan = apPlan;
        if (isActive !== undefined) pricing.isActive = isActive;
        if (notes !== undefined) pricing.notes = notes;
        pricing.updatedBy = updatedBy || propertyId;

        await pricing.save();
        await pricing.populate('ratePlanId');

        return NextResponse.json({
            success: true,
            message: 'Plan pricing updated successfully',
            data: pricing
        });

    } catch (error) {
        console.error('Plan Pricing PUT Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update plan pricing',
            error: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete plan pricing
export async function DELETE(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const pricingId = searchParams.get('pricingId');
        const propertyId = searchParams.get('propertyId');

        if (!pricingId || !propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Pricing ID and Property ID are required'
            }, { status: 400 });
        }

        const pricing = await PlanPricing.findOneAndDelete({ _id: pricingId, propertyId });

        if (!pricing) {
            return NextResponse.json({
                success: false,
                message: 'Plan pricing not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Plan pricing deleted successfully'
        });

    } catch (error) {
        console.error('Plan Pricing DELETE Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete plan pricing',
            error: error.message
        }, { status: 500 });
    }
}
