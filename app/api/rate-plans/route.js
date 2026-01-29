import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import RatePlan from '@/models/RatePlan';
import PropertyRegistration from '@/models/PropertyRegistration';

// GET - Fetch rate plans
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');
        const activeOnly = searchParams.get('activeOnly') === 'true';
        const planId = searchParams.get('planId');

        if (!propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Property ID is required'
            }, { status: 400 });
        }

        // Single plan query
        if (planId) {
            const plan = await RatePlan.findOne({ _id: planId, propertyId }).lean();

            if (!plan) {
                return NextResponse.json({
                    success: false,
                    message: 'Rate plan not found'
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: plan
            });
        }

        // Get all plans for property
        const query = { propertyId };
        if (activeOnly) {
            query.isActive = true;
        }

        const plans = await RatePlan.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            count: plans.length,
            data: plans
        });

    } catch (error) {
        console.error('Rate Plan GET Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch rate plans',
            error: error.message
        }, { status: 500 });
    }
}

// POST - Create a new rate plan
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            propertyId,
            planName,
            planTypes,
            numberOfDays,
            isActive,
            notes,
            createdBy
        } = body;

        // Validation
        if (!propertyId || !planName) {
            return NextResponse.json({
                success: false,
                message: 'Property ID and Plan Name are required'
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

        // Check if plan name already exists for this property
        const existingPlan = await RatePlan.findOne({ propertyId, planName });
        if (existingPlan) {
            return NextResponse.json({
                success: false,
                message: 'A rate plan with this name already exists for this property'
            }, { status: 400 });
        }

        // Check if at least one plan type is selected
        const hasSelectedPlan = planTypes && (
            planTypes.ep || planTypes.cp || planTypes.map || planTypes.ap
        );

        if (!hasSelectedPlan) {
            return NextResponse.json({
                success: false,
                message: 'Please select at least one plan type (EP, CP, MAP, or AP)'
            }, { status: 400 });
        }

        // Create rate plan
        const ratePlan = await RatePlan.create({
            propertyId,
            planName,
            planTypes: planTypes || { ep: false, cp: false, map: false, ap: false },
            numberOfDays: numberOfDays || 0,
            isActive: isActive !== undefined ? isActive : true,
            notes: notes || '',
            createdBy: createdBy || propertyId,
            updatedBy: createdBy || propertyId
        });

        return NextResponse.json({
            success: true,
            message: 'Rate plan created successfully',
            data: ratePlan
        }, { status: 201 });

    } catch (error) {
        console.error('Rate Plan POST Error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: 'A rate plan with this name already exists'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Failed to create rate plan',
            error: error.message
        }, { status: 500 });
    }
}

// PUT - Update an existing rate plan
export async function PUT(request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            planId,
            propertyId,
            planName,
            planTypes,
            numberOfDays,
            isActive,
            notes,
            updatedBy
        } = body;

        // Validation
        if (!planId || !propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Plan ID and Property ID are required'
            }, { status: 400 });
        }

        // Find the plan
        const plan = await RatePlan.findOne({ _id: planId, propertyId });
        if (!plan) {
            return NextResponse.json({
                success: false,
                message: 'Rate plan not found'
            }, { status: 404 });
        }

        // Check if plan name is being changed and if it conflicts
        if (planName && planName !== plan.planName) {
            const existingPlan = await RatePlan.findOne({
                propertyId,
                planName,
                _id: { $ne: planId }
            });

            if (existingPlan) {
                return NextResponse.json({
                    success: false,
                    message: 'A rate plan with this name already exists'
                }, { status: 400 });
            }
        }

        // Update fields
        if (planName) plan.planName = planName;
        if (planTypes) plan.planTypes = planTypes;
        if (numberOfDays !== undefined) plan.numberOfDays = numberOfDays;
        if (isActive !== undefined) plan.isActive = isActive;
        if (notes !== undefined) plan.notes = notes;
        plan.updatedBy = updatedBy || propertyId;

        await plan.save();

        return NextResponse.json({
            success: true,
            message: 'Rate plan updated successfully',
            data: plan
        });

    } catch (error) {
        console.error('Rate Plan PUT Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update rate plan',
            error: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete a rate plan
export async function DELETE(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const planId = searchParams.get('planId');
        const propertyId = searchParams.get('propertyId');

        if (!planId || !propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Plan ID and Property ID are required'
            }, { status: 400 });
        }

        const plan = await RatePlan.findOneAndDelete({ _id: planId, propertyId });

        if (!plan) {
            return NextResponse.json({
                success: false,
                message: 'Rate plan not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Rate plan deleted successfully'
        });

    } catch (error) {
        console.error('Rate Plan DELETE Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete rate plan',
            error: error.message
        }, { status: 500 });
    }
}
