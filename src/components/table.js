import React, { useEffect } from 'react'
import {Table} from 'antd'
import { useUserStore } from '../store/store'
import { fetchUsers } from '../controllers/apiController';
import styled from 'styled-components';
import ColumnSearch from './columnSearch';
import InfoModal
 from './modals/moreInfo';
const Container = styled.div`
    width: 100%;
    display: grid;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
`;

const Wrapper = styled.div`
    max-width: 1200px;
    height: 600px;
    overflow: auto;
`;

const UserInfoTable = () => {

    const {users, openModal} = useUserStore();
    
    useEffect(()=> {
        fetchUsers();
    }, [])

    const columns = [
        {
            title: 'ФИО',
            dataIndex: 'fullName',
            key: 'fullName',
            ...ColumnSearch({dataIndex: 'fullname'}).getColumnSearchProps(),
            ellipsis: true,
            sorter: (a, b) => a.fullName.localeCompare(b.fullName), 
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Возраст',
            dataIndex: 'age',
            key: 'age',
            ...ColumnSearch({dataIndex: 'age'}).getColumnSearchProps(),
            ellipsis: true,
            sorter: (a, b) => a.age - b.age,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Пол',
            dataIndex: 'gender',
            key: 'gender',
            ...ColumnSearch({dataIndex: 'gender'}).getColumnSearchProps(),
            ellipsis: true,
            sorter: (a, b) => a.gender.localeCompare(b.gender),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
            ...ColumnSearch({dataIndex: 'phone'}).getColumnSearchProps(),
            ellipsis: true,
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            ...ColumnSearch({dataIndex: 'address'}).getColumnSearchProps(),
            ellipsis: true,
            sorter: (a, b) => a.address.localeCompare(b.address),
            sortDirections: ['ascend', 'descend'],
        },
    ];

    const handleScroll = async (e) => {
        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {//инфинити скрол
            fetchUsers();
        }
    };

    const handleRowClick = async (id) => {
        
        openModal(id);
    }

    return (
        <>
        <Container>
            <Wrapper onScroll={handleScroll}>
                <Table dataSource = {users} 
                columns={columns} 
                pagination={false} 
                rowKey={(record)=>record.key} 
                bordered={true} 
                sticky  
                onRow={(record) => {return {onClick: () => handleRowClick(record.id)}}}            />
            </Wrapper>
        </Container>
        <InfoModal/>
        </>
    )
}

export default UserInfoTable;