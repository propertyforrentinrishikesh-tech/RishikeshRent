"use client"
import React, { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const InvoicesPayouts = () => {
    const [selectedInvoices, setSelectedInvoices] = useState([])

    const invoices = [
        {
            id: 1,
            document: 'Tax payment overview',
            number: '3500477948',
            date: 'Sep 4 2025',
            period: 'Aug 1 - Aug 31',
            status: 'Overdue (due by Sep 17 2025)',
            amount: '₹ 484.00',
            statusColor: 'text-red-600'
        },
        {
            id: 2,
            document: 'Commission',
            number: '1638927923',
            date: 'Sep 3 2025',
            period: 'Aug 1 - Aug 31',
            status: 'Overdue (due by Sep 16 2025)',
            amount: '₹ 600.00',
            statusColor: 'text-red-600'
        },
        {
            id: 3,
            document: 'Tax payment overview',
            number: '3003842027',
            date: 'Jul 4 2025',
            period: 'Jun 1 - Jun 30',
            status: 'Overdue (due by Jul 17 2025)',
            amount: '₹ 2,831.40',
            statusColor: 'text-red-600'
        },
        {
            id: 4,
            document: 'Commission',
            number: '1632481036',
            date: 'Jul 3 2025',
            period: 'Jun 1 - Jun 30',
            status: 'Overdue (due by Jul 16 2025)',
            amount: '₹ 3,510.00',
            statusColor: 'text-red-600'
        }
    ]

    const toggleInvoice = (id) => {
        setSelectedInvoices(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const totalAmount = invoices.reduce((sum, inv) => {
        const amount = parseFloat(inv.amount.replace(/[₹,\s]/g, ''))
        return sum + amount
    }, 0)

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoices Payouts History</h1>
                <p className="text-sm text-gray-600">Finance &gt; Reservation Statements</p>
            </div>

            {/* Alert Banner */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-red-600 font-semibold">
                        Closed/Not bookable:
                    </div>
                    <p className="text-sm text-gray-700">
                        Your property is closed because your unpaid invoices have been written off as outstanding debt.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap">
                    How can I reopen my property?
                </Button>
            </div>

            {/* Invoices Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                        We produce your invoices based on the check-out dates of your reservations.
                    </p>
                    <p className="text-sm text-gray-700">
                        Legal company name: <span className="text-blue-600">Hotel Maya Residency Sonprayag</span>
                    </p>
                </div>

                {/* Outstanding Balances */}
                <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Outstanding balances</h3>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b-2 border-gray-300">
                                    <th className="p-3 text-left">
                                        <Checkbox />
                                    </th>
                                    <th className="p-3 text-left font-semibold text-gray-700">Document</th>
                                    <th className="p-3 text-left font-semibold text-gray-700">Number</th>
                                    <th className="p-3 text-left font-semibold text-gray-700">Date</th>
                                    <th className="p-3 text-left font-semibold text-gray-700">Period</th>
                                    <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
                                    <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                                    <th className="p-3 text-right font-semibold text-gray-700">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice, index) => (
                                    <tr
                                        key={invoice.id}
                                        className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                    >
                                        <td className="p-3">
                                            <Checkbox
                                                checked={selectedInvoices.includes(invoice.id)}
                                                onCheckedChange={() => toggleInvoice(invoice.id)}
                                            />
                                        </td>
                                        <td className="p-3 text-sm">{invoice.document}</td>
                                        <td className="p-3 text-sm">
                                            <span className="text-blue-600">{invoice.number}</span>
                                            <FileText className="inline h-4 w-4 ml-1 text-gray-400" />
                                        </td>
                                        <td className="p-3 text-sm">{invoice.date}</td>
                                        <td className="p-3 text-sm">{invoice.period}</td>
                                        <td className="p-3 text-sm">
                                            <div className="flex gap-2">
                                                <a href="#" className="text-blue-600 hover:underline">PDF ⬇</a>
                                                {invoice.document === 'Commission' && (
                                                    <>
                                                        <span>|</span>
                                                        <a href="#" className="text-blue-600 hover:underline">View statement</a>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <span className={invoice.statusColor}>{invoice.status}</span>
                                        </td>
                                        <td className="p-3 text-sm text-right font-semibold">{invoice.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Amount */}
                    <div className="mt-4 flex justify-end">
                        <div className="text-right space-y-1">
                            <p className="text-sm text-gray-600">Total amount due: ₹ {totalAmount.toFixed(2)}</p>
                            <p className="text-lg font-bold text-gray-900">Amount to be paid: ₹ {totalAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Proceed to Pay Button */}
                    <div className="mt-6">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold">
                            Proceed to pay
                        </Button>
                    </div>

                    {/* Payment Instructions */}
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">
                            If you'd like to pay via bank transfer, refer to the{' '}
                            <a href="#" className="text-blue-600 hover:underline">payment instructions</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoicesPayouts
