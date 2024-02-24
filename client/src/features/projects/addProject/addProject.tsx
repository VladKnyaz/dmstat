import React, { FC } from "react";
import { Button, Form, Input, Tooltip, Typography, notification } from "antd";
import { useAddProjectMutation } from "../../../entities/projects";

const AddProject: FC = () => {
  const [form] = Form.useForm();
  const [addProject, { isLoading, isError }] = useAddProjectMutation();
  const [api, contextHolder] = notification.useNotification();

  const openNotify = (title: string, text: string) => {
    api.info({
      message: title,
      description: text,
      placement: "topRight",
    });
  };

  const createProject = async (data: {
    projectName: string;
    color: string;
  }) => {
    let res = await addProject({
      color: data.color,
      projectName: data.projectName,
    });

    if ("error" in res) {
      //@ts-ignore
      openNotify("Ошибка", res.error);
      return;
    } else if ("message" in res.data) {
      openNotify("Ответ от сервера", String(res.data.message));
    } else {
      openNotify("Проект добавлен", "");
    }
  };

  return (
    <Form form={form} onFinish={createProject} layout="vertical">
      {contextHolder}

      <Tooltip
        title={
          <>
            <Typography.Text>Название проекта из </Typography.Text>
            <a href="https://rage.mp/ru/servers" target="_blank">
              rage.mp
            </a>
          </>
        }
      >
        <Form.Item
          label="Название проекта"
          name="projectName"
          rules={[{ required: true, message: "Название обязательно" }]}
        >
          <Input placeholder="Название" />
        </Form.Item>
      </Tooltip>

      <Form.Item
        label="Цвет"
        name="color"
        rules={[{ required: true, message: "Цвет обязателен" }]}
      >
        <Input placeholder="HEX цвет ( #fff )" />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          disabled={isError}
          loading={isLoading}
        >
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
};

export { AddProject };
