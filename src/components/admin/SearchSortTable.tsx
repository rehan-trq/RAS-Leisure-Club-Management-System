
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, SortAsc, SortDesc, Filter, ArrowDown, ArrowUp, X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SortDirection = 'asc' | 'desc' | null;
type SortConfig<T> = {
  key: keyof T | null;
  direction: SortDirection;
};

type FilterConfig<T> = {
  key: keyof T;
  value: string;
};

interface SearchSortTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T; 
    header: string;
    render?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
  }>;
  searchable?: boolean;
  defaultSortColumn?: keyof T;
  defaultSortDirection?: SortDirection;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  emptyMessage?: string;
}

function SearchSortTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  defaultSortColumn = null,
  defaultSortDirection = null,
  onRowClick,
  rowClassName,
  emptyMessage = "No data available"
}: SearchSortTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: defaultSortColumn,
    direction: defaultSortDirection,
  });
  const [filters, setFilters] = useState<FilterConfig<T>[]>([]);
  const [filterKey, setFilterKey] = useState<string>('');
  const [filterValue, setFilterValue] = useState('');

  // Get sortable columns
  const sortableColumns = useMemo(() => 
    columns.filter(column => column.sortable !== false)
           .map(column => column.key), 
  [columns]);

  // Get filterable columns
  const filterableColumns = useMemo(() => 
    columns.filter(column => column.filterable !== false)
           .map(column => ({key: column.key, header: column.header})), 
  [columns]);

  // Handle sorting
  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  // Add a filter
  const addFilter = () => {
    if (!filterKey || !filterValue) return;
    
    const newFilter = {
      key: filterKey as keyof T,
      value: filterValue
    };
    
    setFilters([...filters, newFilter]);
    setFilterKey('');
    setFilterValue('');
  };

  // Remove a filter
  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  // Apply search, sort and filters to data
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply filters
    filters.forEach(filter => {
      result = result.filter(item => {
        const value = item[filter.key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        } else if (typeof value === 'number') {
          return value.toString().includes(filter.value);
        }
        return false;
      });
    });
    
    // Apply search
    if (searchTerm) {
      result = result.filter(item => {
        return columns.some(column => {
          const value = item[column.key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (typeof value === 'number') {
            return value.toString().includes(searchTerm);
          }
          return false;
        });
      });
    }
    
    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [data, sortConfig, searchTerm, filters, columns]);

  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {searchable && (
          <div className="relative flex-1">
            <div className="absolute left-3 top-3 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        
        {filterableColumns.length > 0 && (
          <div className="flex gap-2">
            <Select value={filterKey} onValueChange={setFilterKey}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {filterableColumns.map(column => (
                  <SelectItem key={String(column.key)} value={String(column.key)}>
                    {column.header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 min-w-[180px]">
              <Input
                placeholder="Filter value"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={addFilter} disabled={!filterKey || !filterValue}>
              <Filter className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>
        )}
      </div>
      
      {/* Active filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => {
            const columnInfo = columns.find(col => col.key === filter.key);
            return (
              <div 
                key={index} 
                className="bg-muted text-sm py-1 px-3 rounded-full flex items-center"
              >
                <span className="font-medium mr-1">{columnInfo?.header || String(filter.key)}:</span>
                <span>{filter.value}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 hover:bg-background/60"
                  onClick={() => removeFilter(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
          {filters.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7" 
              onClick={() => setFilters([])}
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)}
                  className={cn(
                    sortableColumns.includes(column.key) && "cursor-pointer hover:bg-accent",
                    column.width
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => {
                    if (sortableColumns.includes(column.key)) {
                      requestSort(column.key);
                    }
                  }}
                >
                  <div className="flex items-center">
                    {column.header}
                    {sortableColumns.includes(column.key) && sortConfig.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : sortConfig.direction === 'desc' ? (
                          <ArrowDown className="h-4 w-4" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length > 0 ? (
              processedData.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex} 
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-accent/50",
                    rowClassName && rowClassName(row)
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]?.toString() || ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default SearchSortTable;
