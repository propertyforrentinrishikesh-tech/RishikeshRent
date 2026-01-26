"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const FinancialOverview = () => {
    const [selectedPayouts, setSelectedPayouts] = useState([])

    const payouts = [
        { id: 1, date: '', guestName: '', status: 'Pending', statusColor: 'text-red-600', amount: '', commissions: '', taxAmount: '' },
        { id: 2, date: '', guestName: '', status: 'Pending', statusColor: 'text-red-600', amount: '', commissions: '', taxAmount: '' },
        { id: 3, date: '', guestName: '', status: 'Clear', statusColor: 'text-green-600', amount: '', commissions: '', taxAmount: '' },
        { id: 4, date: '', guestName: '', status: 'Over Due', statusColor: 'text-blue-600', amount: '', commissions: '', taxAmount: '' },
        { id: 5, date: '', guestName: '', status: 'Over Due', statusColor: 'text-blue-600', amount: '', commissions: '', taxAmount: '' },
        { id: 6, date: '', guestName: '', status: 'Clear', statusColor: 'text-green-600', amount: '', commissions: '', taxAmount: '' }
    ]

    const togglePayout = (id) => {
        setSelectedPayouts(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleAll = () => {
        if (selectedPayouts.length === payouts.length) {
            setSelectedPayouts([])
        } else {
            setSelectedPayouts(payouts.map(p => p.id))
        }
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">All Financial Overview</h1>
                <p className="text-sm text-gray-600">Finance &gt; All Type Payouts</p>
            </div>

            {/* Payouts Table */}
            <div className="border-l-4 border-blue-600 pl-0">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                <th className="p-3 text-left">
                                    <Checkbox
                                        checked={selectedPayouts.length === payouts.length}
                                        onCheckedChange={toggleAll}
                                    />
                                </th>
                                <th className="p-3 text-left font-semibold text-gray-700">S No</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Date</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Guest Name</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                                <th className="p-3 text-right font-semibold text-gray-700">Amount</th>
                                <th className="p-3 text-right font-semibold text-gray-700">Commissions</th>
                                <th className="p-3 text-right font-semibold text-gray-700">Tax Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.map((payout, index) => (
                                <tr
                                    key={payout.id}
                                    className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                >
                                    <td className="p-3">
                                        <Checkbox
                                            checked={selectedPayouts.includes(payout.id)}
                                            onCheckedChange={() => togglePayout(payout.id)}
                                        />
                                    </td>
                                    <td className="p-3 text-sm font-semibold">{payout.id}</td>
                                    <td className="p-3 text-sm">{payout.date || '-'}</td>
                                    <td className="p-3 text-sm">{payout.guestName || '-'}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`font-semibold ${payout.statusColor}`}>
                                            {payout.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-right">{payout.amount || '-'}</td>
                                    <td className="p-3 text-sm text-right">{payout.commissions || '-'}</td>
                                    <td className="p-3 text-sm text-right">{payout.taxAmount || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total Amounts */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-8 max-w-2xl ml-auto">
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900">-</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900">-</p>
                        </div>
                    </div>
                </div>

                {/* Proceed to Pay Button */}
                <div className="mt-6">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold">
                        Proceed to pay
                    </Button>
                </div>
            </div>

            {/* Status Legend */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Status Legend:</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-600 rounded"></div>
                        <span className="text-sm text-gray-700">Pending - Payment not yet received</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                        <span className="text-sm text-gray-700">Clear - Payment completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        <span className="text-sm text-gray-700">Over Due - Payment overdue</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinancialOverview
