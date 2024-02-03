import React, { FC } from "react";
import { Button, Form, Input, Tooltip, Typography } from "antd";
import { useAddProjectMutation } from "../../../entities/projects";

const AddProject: FC = () => {
  const [form] = Form.useForm();
  const [addProject, { isLoading }] = useAddProjectMutation();

  const createProject = async (kek: { projectName: string; color: string }) => {
    let a = await addProject({
      color: kek.color,
      projectName: kek.projectName,
    });
  };

  return (
    <Form form={form} onFinish={createProject} layout="vertical">
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
        <Button htmlType="submit" type="primary" loading={isLoading}>
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
};

export { AddProject };
