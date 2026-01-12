'use client'

import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table } from '@tanstack/react-table'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-media-query'
import { Badge } from '@/components/ui/badge'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  searchColumn?: string
  filters?: {
    column: string
    title: string
    options: { label: string; value: string }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Ara...',
  searchColumn,
  filters,
}: DataTableToolbarProps<TData>) {
  const isMobile = useIsMobile()
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const isFiltered = table.getState().columnFilters.length > 0
  const activeFilterCount = table.getState().columnFilters.length

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      {/* Search - Always visible */}
      <InputGroup className="w-full flex-1 sm:max-w-sm">
        <InputGroupAddon>
          <Search className="text-muted-foreground h-4 w-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={searchPlaceholder}
          value={
            searchColumn
              ? ((table.getColumn(searchColumn)?.getFilterValue() as string) ??
                '')
              : ''
          }
          onChange={(event) => {
            if (searchColumn) {
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
          }}
        />
      </InputGroup>

      {/* Mobile: Collapsible Filters */}
      {isMobile ? (
        <Accordion
          type="single"
          collapsible
          value={isFilterExpanded ? 'filters' : ''}
          onValueChange={(value) => setIsFilterExpanded(value === 'filters')}
          className="w-full"
        >
          <AccordionItem value="filters" className="border-0">
            <AccordionTrigger className="hover:no-underline py-2">
              <div className="flex items-center gap-2">
                Filtreler
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3 pt-2">
              {/* Filters */}
              {filters?.map((filter) => {
                const column = table.getColumn(filter.column)
                const selectedValue = column?.getFilterValue() as string | undefined

                return (
                  <Select
                    key={filter.column}
                    value={selectedValue ?? 'all'}
                    onValueChange={(value) => {
                      column?.setFilterValue(value === 'all' ? undefined : value)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={filter.title} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              })}

              {/* Clear button */}
              {isFiltered && (
                <Button
                  variant="ghost"
                  onClick={() => table.resetColumnFilters()}
                  className="w-full justify-start"
                >
                  <X className="mr-2 h-4 w-4" />
                  Temizle
                </Button>
              )}

              {/* Column visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Görünüm
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuLabel>Sütunları Göster</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== 'undefined' &&
                        column.getCanHide()
                    )
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        /* Desktop: Inline Filters */
        <div className="flex w-full items-center gap-2 sm:w-auto">
          {filters?.map((filter) => {
            const column = table.getColumn(filter.column)
            const selectedValue = column?.getFilterValue() as string | undefined

            return (
              <Select
                key={filter.column}
                value={selectedValue ?? 'all'}
                onValueChange={(value) => {
                  column?.setFilterValue(value === 'all' ? undefined : value)
                }}
              >
                <SelectTrigger className="w-32.5">
                  <SelectValue placeholder={filter.title} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          })}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 lg:px-3"
            >
              Temizle
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Görünüm
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-45">
              <DropdownMenuLabel>Sütunları Göster</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
