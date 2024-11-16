"use client";

import { RankingInfo, rankItem, rankings } from '@tanstack/match-sorter-utils';
import type { ColumnDef } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { TableDataPrimitiveObject } from '@/types';
import { Box, Button, Card, FormControl, MenuItem, Paper, Select, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { Row } from '@tanstack/react-table';
import { useDrag, useDrop } from 'react-dnd';
import { DebouncedInput } from './DebouncedInput';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter = <TData extends Record<string, any> = object>(
    row: Row<TData>,
    columnId: string,
    value: string | number,
    addMeta: (arg0: { itemRank: RankingInfo }) => void
) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value as string, {
        threshold: rankings.MATCHES
    });

    // Store the itemRank info
    addMeta({
        itemRank
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

//
const DraggableRow = <T extends TableDataPrimitiveObject>({
    row,
    reorderRow
}: {
    row: Row<T>;
    reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
}) => {
    const [, dropRef] = useDrop({
        accept: 'row',
        drop: (draggedRow: Row<T>) => reorderRow(draggedRow.index, row.index)
    });

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        item: () => row,
        type: 'row'
    });

    return (
        <TableRow
            ref={previewRef} //previewRef could go here
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <TableCell ref={dropRef} style={{ width: '10px' }}>
                {/* <div className="d-flex"> */}
                <button
                    className="btn btn-sm btn-transparent mt-3 d-none d-md-block"
                    style={{ cursor: 'grabbing' }}
                    ref={dragRef}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        height={'20px'}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
                {/* </div> */}
            </TableCell>
            {row.getVisibleCells().map((cell) => (
                <td key={cell.id} scope="row" className="py-4 whitespace-nowrap">
                    <div className="d-flex align-items-center justify-content-start">
                        <div className="fs-3 text-lg text-gray-900 w-100 d-flex">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    </div>
                </td>
            ))}
        </TableRow>
    );
};

export interface CustomTableProps<T extends TableDataPrimitiveObject> {
    title?: string;
    data: T[];
    columns: ColumnDef<T, string | number>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    isLoading?: boolean;
    draggable?: boolean;
}

export const TableComponent = <T extends TableDataPrimitiveObject>({
    data: tableData,
    columns: tableColumns,
    title,
    searchable = true,
    searchPlaceholder = 'Search',
    isLoading,
    draggable
}: CustomTableProps<T>) => {
    const [globalFilter, setGlobalFilter] = useState('');
    // const data = useMemo(() => tableData, [tableData]);
    const [data, setData] = useState<T[]>([]);
    const columns = useMemo(() => tableColumns, [tableColumns]);

    useEffect(() => {
        setData(tableData);
    }, [tableData]);

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row) => row.id.toString(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues()
    });

    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const rowsPerPage = table.getRowModel().rows.length;

    // Calculate the current range of records being displayed
    const startIndex = useMemo(() => pageIndex * pageSize, [pageIndex, pageSize]);
    const endIndex = useMemo(
        () => startIndex + (rowsPerPage || 1 - 1),
        [startIndex, rowsPerPage]
    );

    // what to do after row has been reordered
    const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
        data.splice(targetRowIndex, 0, data.splice(draggedRowIndex, 1)[0]);
        setData([...data]);
    };

    return (
        <Card>
            <Box
                overflow={'hidden'}
                mt={!searchable ? 'mt-6' : "inherit"}
            // className={`overflow-hidden sm:-mx-6 lg:-mx-8  ${!searchable && 'mt-6'}`}
            >
                <Box alignItems={"center"} width={"100%"}
                // className="align-items-middle w-full sm:px-6 lg:px-8"
                >
                    <Box
                        bgcolor={"white"}
                        border={'#D4D4D8'}
                        px={5}
                        py={1}
                        whiteSpace={"nowrap"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={title ? "space-between" : "end"}
                    >
                        <div>
                            {title && (
                                <h3 className="text-sm fw-medium display-5 ">{title}</h3>
                            )}
                        </div>

                        {!isLoading && (
                            <div className="w-full">
                                <div className="position-relative rounded-md">
                                    <DebouncedInput
                                        value={globalFilter ?? ''}
                                        onChange={(value: ChangeEvent<HTMLInputElement>) =>
                                            setGlobalFilter(String(value))
                                        }
                                        placeholder={searchPlaceholder}
                                    />
                                </div>
                            </div>
                        )}
                    </Box>
                    <TableContainer component={Paper} elevation={0} className="overflow-auto w-full border border-[#D4D4D8] border-t-0">
                        <Table>
                            <TableHead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {draggable && <th className=""></th>}
                                        {headerGroup.headers.map((header) => {
                                            if (header.id === 'actions') {
                                                return (
                                                    <TableCell key={header.id}>
                                                        <Box display={"flex"} width={"100%"} alignItems={"center"} justifyContent={"end"}>
                                                            {header.isPlaceholder ? null : (
                                                                <Button variant={"text"} color={"inherit"} disabled onClick={() => header.column.toggleSorting()} sx={header.column.getCanSort() ? { cursor: "pointer" } : { cursor: "default" }} size={"small"}>
                                                                    {/* <Flex alignItems={"center"}> */}
                                                                    <Typography component={"span"} variant='body2' ml={2}>
                                                                        {flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                    </Typography>
                                                                    {/* </Flex> */}
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                )
                                            }
                                            return (
                                                <TableCell
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    scope="col"
                                                >
                                                    <Box display={"flex"} width={"100%"} alignItems={"center"} justifyContent={["id", "actions"].includes(header.id) ? "start" : "center"}>
                                                        {header.isPlaceholder ? null : (
                                                            <Button
                                                                {...{
                                                                    className: header.column.getCanSort()
                                                                        ? 'cursor-pointer select-none bg-transparent border-0 fs-1'
                                                                        : 'bg-transparent border-0 fs-1',
                                                                    onClick:
                                                                        header.column.getToggleSortingHandler(),
                                                                }}
                                                                // sx={{ mx: ["id", "actions"].includes(header.id) ? "initial" : "auto" }}
                                                                variant="text"
                                                                disabled={!header.column.getCanSort()}
                                                            >
                                                                <Box display={"flex"} alignItems={"center"}>
                                                                    <span>
                                                                        {flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                    </span>

                                                                    {/* sort icons  */}
                                                                    {header.column.getCanSort() && (
                                                                        <SvgIcon>
                                                                            {{
                                                                                asc: (
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                        strokeWidth="1.5"
                                                                                        stroke="currentColor"
                                                                                    >
                                                                                        <path
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
                                                                                        />
                                                                                    </svg>
                                                                                ),
                                                                                desc: (
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                        strokeWidth="1.5"
                                                                                        stroke="currentColor"
                                                                                    >
                                                                                        <path
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
                                                                                        />
                                                                                    </svg>
                                                                                ),
                                                                                none: <></>
                                                                            }[
                                                                                header.column.getIsSorted()
                                                                                    ? String(header.column.getIsSorted())
                                                                                    : 'none'
                                                                            ] ?? <></>}
                                                                        </SvgIcon>
                                                                    )}
                                                                </Box>
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody className="bg-white divide-y divide-[#D2E1EF]">
                                {/* if isLoading, use skeleton rows  */}
                                {isLoading &&
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i} className="hover:bg-gray-100">
                                            {table.getHeaderGroups()[0].headers.map((header) => {
                                                return (
                                                    <TableCell
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                        className="px-6 py-4 whitespace-nowrap"
                                                    >
                                                        <div className="d-flex align-items-center justify-content-center  w-full">
                                                            <div className="text-sm text-gray-900 w-full">
                                                                <TdSkeleton />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                {!isLoading &&
                                    table.getRowModel().rows.map((row) => {
                                        if (draggable) {
                                            return (
                                                <DraggableRow
                                                    row={row}
                                                    key={row.id}
                                                    reorderRow={reorderRow}
                                                />
                                            );
                                        }
                                        return (
                                            <TableRow key={row.id} className="hover:bg-gray-100">
                                                {row.getVisibleCells().map((cell) => {
                                                    switch (cell.column.id) {
                                                        case 'actions':
                                                            return (
                                                                <TableCell
                                                                    key={cell.id}
                                                                    scope="row"
                                                                    className="py-4 whitespace-nowrap"
                                                                >
                                                                    <Box display="flex" alignItems="center" justifyContent="center">
                                                                        {flexRender(
                                                                            cell.column.columnDef.cell,
                                                                            cell.getContext()
                                                                        )}
                                                                    </Box>
                                                                </TableCell>
                                                            )
                                                        case "id":
                                                            return (
                                                                <TableCell
                                                                    key={cell.id}
                                                                    scope="row"
                                                                    className="py-4 whitespace-nowrap"
                                                                >
                                                                    <Box display={"flex"} alignItems={"center"} justifyContent={"start"}>
                                                                        <Typography sx={{ mr: "auto" }} className="fs-3 text-lg text-gray-900 w-100 d-flex">
                                                                            {flexRender(
                                                                                cell.column.columnDef.cell,
                                                                                cell.getContext()
                                                                            )}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            )
                                                        default:
                                                            return (
                                                                <TableCell
                                                                    key={cell.id}
                                                                    scope="row"
                                                                    className="py-4 whitespace-nowrap"
                                                                >
                                                                    <Box display={"flex"} alignItems={"center"} justifyContent={"start"} className="d-flex align-items-center justify-content-center">
                                                                        <Typography sx={{ mx: "auto" }} className="fs-3 text-lg text-gray-900 w-100 d-flex">
                                                                            {flexRender(
                                                                                cell.column.columnDef.cell,
                                                                                cell.getContext()
                                                                            )}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            )
                                                    }
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                {table.getRowModel().rows.length < 1 && (
                                    <TableRow className="w-100 text-center"><TableCell> No data available!</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {!isLoading && table.getPageCount() > 0 && (
                        <Box display="flex" py={3} gap={2} px={3} alignItems={'center'} justifyContent={"space-between"} className="text-xl text-gray-500 d-flex py-3 gap-2   gap-md-5 px-3 align-items-center justify-content-end">
                            <Box component={"span"} display={"flex"} gap={1} className="d-flex flex-column flex-md-row align-items-md-center gap-1">
                                <div>Showing</div>
                                {startIndex + 1} - {endIndex} of {table.getPageCount()}{' '}
                                {table.getPageCount() > 1 ? 'pages' : 'page'}
                            </Box>

                            {(table.getCanPreviousPage() || table.getCanNextPage()) && (
                                <div>
                                    <Button
                                        className={`mx-2 ${table.getCanPreviousPage() ? 'text-blck' : 'text-white'}`}
                                        color="info"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth="0"
                                            version="1.1"
                                            viewBox="0 0 17 17"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g></g>
                                            <path d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z"></path>
                                        </svg>
                                    </Button>
                                    <Button
                                        className={`ml-4 ${table.getCanNextPage() ? 'text-black' : 'text-white'
                                            } `}
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        color="info"
                                    >
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth="0"
                                            version="1.1"
                                            viewBox="0 0 17 17"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g></g>
                                            <path d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z"></path>
                                        </svg>
                                    </Button>
                                </div>
                            )}

                            <FormControl size='small'>
                                <Select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        table.setPageSize(Number(e.target.value));
                                    }}
                                    label="Age"
                                    variant='standard'
                                >
                                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                        <MenuItem key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </Box>
            </Box>
        </Card>
    );
};

const TdSkeleton = () => {
    return (
        <div className="w-full h-full">
            <div className="w-full h-5 bg-gray-200 animate-pulse"></div>
        </div>
    );
};