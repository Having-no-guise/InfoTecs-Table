import { useUserStore } from "../store/store";
import {message} from "antd";

const URL = process.env.REACT_APP_API_URL 



const myFetch = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        // Проверка статуса ошибки
            if (response.status >= 400 && response.status < 500) {
                message.error('Ошибка на стороне клиента. Проверьте запрос.');
            } else if (response.status >= 500) {
                message.error('Ошибка на стороне сервера. Попробуйте позже.');
            }
        

        return await response;
    } catch (error) {
        console.error('Fetch failed:', error);
        message.error('Произошла ошибка при выполнении запроса.');
        throw error;
    }
};


export const fetchUsers = async () => {
    try {
        const { skip, limit, columnKey, searchValue } = useUserStore.getState();

        let url;
        let newUsers = [];

        if (columnKey === 'fullname' && searchValue) {
            // Если фильтр по полному имени. А можно было кинуть запрос на /search?q
            const searchTerms = searchValue.split(' ');

            const promises = searchTerms.map(term =>
                Promise.all([
                    myFetch(`${URL}/filter?key=firstName&value=${term}&limit=${limit}&skip=${skip}`).then(res => res.json()),
                    myFetch(`${URL}/filter?key=lastName&value=${term}&limit=${limit}&skip=${skip}`).then(res => res.json()),
                    myFetch(`${URL}/filter?key=maidenName&value=${term}&limit=${limit}&skip=${skip}`).then(res => res.json())
                ])
            );

            const results = await Promise.all(promises);

            // Объединяем результаты в один массив
            results.forEach(resultSet => {
                resultSet.forEach(result => {
                    newUsers = [...newUsers, ...result.users];
                });
            });

            // Удаляем дубликаты
            newUsers = Array.from(new Set(newUsers.map(user => user.id)))
                .map(id => newUsers.find(user => user.id === id));

        } else if (columnKey === 'address' && searchValue) {
            // Фильтрация по адресу (город или улица)
            const [city, street] = searchValue.split(', ');

            const promises = [
                myFetch(`${URL}/filter?key=address.city&value=${city || searchValue}&limit=${limit}&skip=${skip}`).then(res => res.json()),
                myFetch(`${URL}/filter?key=address.address&value=${street || searchValue}&limit=${limit}&skip=${skip}`).then(res => res.json())
            ];

            const results = await Promise.all(promises);

            results.forEach(result => {
                newUsers = [...newUsers, ...result.users];
            });

            // Удаляем дубликаты
            newUsers = Array.from(new Set(newUsers.map(user => user.id)))
                .map(id => newUsers.find(user => user.id === id));

        } else if (columnKey && searchValue) {
            // Фильтр по другим колонкам
            url = `${URL}/filter?key=${columnKey}&value=${searchValue}&limit=${limit}&skip=${skip}`;
            const response = await myFetch(url);
            const result = await response.json();
            newUsers = result.users;
        } 
            else {
            // Без фильтрации
            url = `${URL}?limit=${limit}&skip=${skip}`;
            const response = await myFetch(url);
            const result = await response.json();
            newUsers = result.users;
        }

        // Преобразуем данные пользователей
        const formattedUsers = newUsers.map(user => ({
            id: user.id,
            fullName: `${user.lastName} ${user.firstName} ${user.maidenName}`,
            age: user.age,
            gender: user.gender,
            phone: user.phone,
            address: `${user.address.city}, ${user.address.address}`,
        }));

        useUserStore.setState(state => ({
            users: skip === 0 ? formattedUsers : [...state.users, ...formattedUsers], 
            total: formattedUsers.length, 
            skip: columnKey && searchValue ? limit : state.skip + state.limit,
        }));
        
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
};

  

export const fetchUserById = async (id) => { 
    try{
        const response = await myFetch(`${URL}/${id}`);
        
        const result = await response.json(); 
        const formattedInfo = {
            id: result.id,
            fullName: `${result.lastName} ${result.firstName} ${result.maidenName}`,
            age: result.age,
            address: `${result.address.city}, ${result.address.address}`,
            height: result.height,
            weight: result.weight,
            phone: result.phone,
            email: result.email
        }
        useUserStore.getState().setUserInfo(formattedInfo);
    }
    catch (error) {
        console.log(error)
    }
}