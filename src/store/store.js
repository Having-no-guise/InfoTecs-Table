import {create} from 'zustand'

export const useUserStore = create((set) => ({
    users: [],//инфа о пользователях
    total: 0,
    skip: 0,
    limit: 30,
    searchText: '',//фильтр-запрос
    searchedColumn: '',
    columnKey: '',//по какой колонке фильтруем
    searchValue: '',//хранит значение фильтра
    isModalOpen: false,
    selectedUserId: '',
    userInfo: '', // тут инфа конкретного юзера для модалки
    setSearchText: (text) => set({ searchText: text }),
    setSearchedColumn: (column) => set({ searchedColumn: column }),
    setColumnKey: (key) => set({ columnKey: key }), // сохраняем ключ колонки
    setSearchValue: (value) => set({ searchValue: value }), // сохраняем значение фильтра
    resetFilters: () => set({ columnKey: '', searchValue: '', skip: 0, searchText: '', searchedColumn:''}), // сброс фильтров и обнуление skip
    openModal: (id) => set({isModalOpen: true, selectedUserId: id}),
    closeModal: () => set({isModalOpen: false, selectedUserId: ''}),
    setUserInfo: (info) => set({userInfo: info}) 
}));