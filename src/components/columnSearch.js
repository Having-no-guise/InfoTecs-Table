//фильтр для таблицы antd.
import React, { useRef } from 'react';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import { useUserStore } from '../store/store';
import { fetchUsers } from '../controllers/apiController';

const ColumnSearch = ({dataIndex}) => {
    const searchInput = useRef(null);
    const { searchText, searchedColumn } = useUserStore();
    
    const handleSearch = async (selectedKeys) => {
      useUserStore.setState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
        columnKey: dataIndex, 
        searchValue: selectedKeys[0], 
        skip: 0, // сбрасываем skip при установке фильтра
      });
    
      
      await fetchUsers();
    };

    const handleReset = async () => {
      useUserStore.getState().resetFilters(); // сбрасываем фильтры в сторе
      await fetchUsers(); 
    };

    const getColumnSearchProps = () => ({
        filterDropdown : ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
    });
    return {getColumnSearchProps};
};

export default ColumnSearch;