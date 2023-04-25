import React  from 'react'
import DataTable from 'react-data-table-component'

import { Loading } from '../../../shared/components/Loading'
import { FilterComponent } from '../../../shared/components/FilterComponent'

export const DataTableRoot = ({ data, columns, isLoading, filterText, setFilterText }) => {

    const headerComponent = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) setFilterText('')
        }
        return (

            <FilterComponent
                onFilter={(e) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        )
    }, [filterText])


    const options = {
        rowsPerPageText: 'Registros por página',
        rangeSeparatorText: 'de'
    }

    return (

        <DataTable
            columns={columns}
            data={data}
            progressPending={isLoading}
            progressComponent={<Loading />}
            noDataComponent={'Sin reportes'}
            pagination
            paginationComponentOptions={options}
            subHeader
            subHeaderComponent={headerComponent}
            persistTableHead
            striped={true}
            highlightOnHover={true}
            defaultSortAsc={false}
            defaultSortFieldId={6}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            paginationPerPage={6}
        />

    )
}
