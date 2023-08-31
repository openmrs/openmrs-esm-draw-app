import React from "react";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Pagination,
} from "@carbon/react";

const DiagramTable = ({
  savedDiagrams,
  onPageChange,
  currentPage,
  pageSize,
  totalItems,
}) => {
  const headers = ["Diagram Name", "Region", "Notation"]; // Customize headers as needed

  return (
    <>
      <DataTable rows={savedDiagrams} headers={headers} useZebraStyles>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow {...getRowProps({ row })} key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.region}</TableCell>
                  <TableCell>{row.notation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
      <Pagination
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Items per page:"
        onChange={onPageChange}
        page={currentPage}
        pageSize={pageSize}
        pageSizes={[10, 20, 30, 40, 50]}
        totalItems={totalItems}
      />
    </>
  );
};

export default DiagramTable;
