import React, {useEffect} from "react";
import {Modal} from "antd";
import { useUserStore } from "../../store/store";
import { fetchUserById } from "../../controllers/apiController";

const InfoModal = () => {
    const { isModalOpen, selectedUserId, closeModal, userInfo } = useUserStore();
    
    useEffect(() => {
        if (isModalOpen && selectedUserId) {
            fetchUserById(selectedUserId); // Запрос при открытии модалки
        }
    }, [isModalOpen, selectedUserId]);

    const handleOk = () => {
        closeModal();
    }

    const handleCancel = () => {
        closeModal();
    }


//ФИО, возраст, адрес (город и название улицы), рост, вес, номер телефона и email-адрес.
    return (
        <>
        <Modal title="User Data" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>ФИО: {userInfo.fullName}</p>
        <p>Возраст: {userInfo.age}</p>
        <p>Адрес: {userInfo.address}</p>
        <p>Рост: {userInfo.height}</p>
        <p>Вес: {userInfo.weight}</p>
        <p>Телефон: {userInfo.phone}</p>
        <p>Почта: {userInfo.email}</p>
      </Modal>
        </>
    )
}

export default InfoModal;