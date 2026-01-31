import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Button from './Button';

const Table = ({ 
  columns, 
  data, 
  sortBy, 
  sortOrder, 
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
}) => {
  const handleSort = (columnKey) => {
    if (onSort) {
      const newSortOrder = sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc';
      onSort(columnKey, newSortOrder);
    }
  };
  
  const getSortIcon = (columnKey) => {
    if (sortBy !== columnKey) return null;
    
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-700 h-10 rounded mb-2"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800 h-12 rounded mb-1"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className={`
                  table-header-cell
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-700 select-none' : ''}
                `}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="table-body">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="table-cell text-center text-gray-400 py-8"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                {columns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Pagination component
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '',
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onPageChange(page)}
          className="min-w-[2.5rem]"
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Table;