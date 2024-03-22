import { FC, useEffect, useState } from "react";
import {
  Button,
  Empty,
  Flex,
  Form,
  Select,
  notification,
} from "antd";


import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "../../../entities/projects";

interface ISelectValues {
  label: string;
  value: string;
}

const DeleteProject: FC = () => {
  const [selectValues, setSelectValues] = useState<ISelectValues[]>();
  const [api, contextHolder] = notification.useNotification();

  const openNotify = (title: string, text: string) => {
    api.info({
      message: title,
      description: text,
      placement: "topRight",
    });
  };

  const {
    data: dataProjects,
    isLoading,
    isSuccess,
  } = useGetProjectsQuery({});

  const [deleteProject] = useDeleteProjectMutation();

  const onFinish = async (data: { projectName: string }) => {
    let res = await deleteProject(data.projectName);

    if ("error" in res) {
      //@ts-ignore
      openNotify("Ошибка", res.error);
      return;
    } else if ("message" in res.data) {
      openNotify("Ответ от сервера", String(res.data.message));
    } else {
      openNotify("Проект удалён", "");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setSelectValues(
        dataProjects.map((project) => {
          return { label: project.projectName, value: project.projectName };
        })
      );
    }
  }, [isSuccess, dataProjects]);

  return (
    <Flex gap={20} vertical>
      {contextHolder}
      <Form onFinish={onFinish}>
        <Form.Item
          name="projectName"
          rules={[{ required: true, message: "Обязательно" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Выберите проект"
            options={selectValues}
            loading={isLoading}
            notFoundContent={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Данные о проектах не загружены"
              />
            }
          ></Select>
        </Form.Item>
        <Form.Item>
          <Button disabled={!isSuccess} danger htmlType="submit">
            Удалить проект
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export { DeleteProject };
