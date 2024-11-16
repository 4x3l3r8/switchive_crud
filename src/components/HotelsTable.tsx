"use client"

import React, { useMemo } from 'react'
import { TableComponent } from './TableComponent'
import { ColumnDef } from '@tanstack/react-table'
import { HotelsTableMenuItems } from './HotelsTableMenuItems'
import { Hotel } from '@/types'

type Props = {}

export const HotelsTable = (props: Props) => {

    const columns = useMemo<ColumnDef<Hotel, string | number>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            id: 'id',
        },
        {
            accessorKey: 'hotelName',
            header: 'Hotel Name',
        },
        {
            accessorKey: 'address',
            header: 'Address',
        },
        {
            accessorKey: 'country',
            header: 'Country',
        },
        {
            accessorKey: 'category',
            header: 'Category',
        },
        {
            accessorFn: async (row) => {
                return row.id
            },
            id: 'actions',
            cell: (info) => {
                return (
                    <HotelsTableMenuItems selectedValue={info.row.original} />
                )
            },
            header: 'Actions',
        }
    ], [])

    const data = useMemo(() => [
        { id: 1, hotelName: 'Hotel 1', address: 'Address 1', country: 'Country 1', category: 1 },
        { id: 2, hotelName: 'Hotel 2', address: 'Address 2', country: 'Country 2', category: 2 },
        { id: 3, hotelName: 'Hotel 3', address: 'Address 3', country: 'Country 3', category: 3 },
        { id: 4, hotelName: 'Hotel 4', address: 'Address 4', country: 'Country 4', category: 4 },
        { id: 5, hotelName: 'Hotel 5', address: 'Address 5', country: 'Country 5', category: 5 },
        { id: 6, hotelName: 'Hotel 6', address: 'Address 6', country: 'Country 6', category: 6 },
        { id: 7, hotelName: 'Hotel 7', address: 'Address 7', country: 'Country 7', category: 7 },
        { id: 8, hotelName: 'Hotel 8', address: 'Address 8', country: 'Country 8', category: 8 },
        { id: 9, hotelName: 'Hotel 9', address: 'Address 9', country: 'Country 9', category: 9 },
        { id: 10, hotelName: 'Hotel 10', address: 'Address 10', country: 'Country 10', category: 10 }
    ], [])

    return (
        <TableComponent title='Hotels' data={data} columns={columns} searchable />
    )
}