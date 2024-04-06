import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectQuery } from "../../entities/projects";
import { Col, Flex, Row, Typography } from "antd";

import { isMobile } from "react-device-detect";
import { ChartColumnProject } from "./../../entities/chartColumnProject/";
import { ChartLineServer } from "./../../entities/chartLineServer";

const Project: FC = () => {
  const params = useParams();
  let projectName = params.projectName;
  const { data: projectData, isLoading, isError } = useGetProjectQuery({ projectName });

  const [online, setOnline] = useState(0);
  const { Title, Text } = Typography;

  useEffect(() => {
    if (projectData) {
      let currentTimeOnline = 0;
      //@ts-ignore
      projectData.servers?.forEach((server) => {
        if (server.timestamps) {
          let stmp = server.timestamps[server.timestamps.length - 1];
          if (stmp) {
            currentTimeOnline += stmp ? stmp.amountPlayers : 0;
          }
        }
      });

      setOnline(currentTimeOnline);
    }
  }, [projectData]);

  const getAvgOnline = () => {
    //@ts-ignore
    return projectData?.servers
      ? //@ts-ignore

        Math.floor(online / projectData.servers.length)
      : 0;
  };

  return (
    <Row justify="center">
      {isLoading && "Загрузка..."}
      {isError && "error"}
      {!isLoading && !projectData && "Проект не найден"}
      {projectData && (
        <Col span={20}>
          <Flex justify="center" gap="middle" vertical align="center">
            <Title level={3}>{projectData?.projectName}</Title>
          </Flex>
          <Flex vertical={isMobile}>
            <Col style={{ width: isMobile ? "100%" : "50%" }}>
              <Title level={5}>Информация</Title>
              <Flex vertical>
                <Text>Название: {projectData.projectName}</Text>

                <Text>
                  Количество серверов:{" "}
                  {
                    //@ts-ignore
                    projectData.servers?.length
                  }
                </Text>
                <Text>
                  Полный онлайн: {online} (Средний: {getAvgOnline()})
                </Text>
              </Flex>
            </Col>
            <Col style={{ width: isMobile ? "100%" : "50%" }}>
              <Title level={5}>График серверов</Title>
              <ChartColumnProject projectData={projectData} />
            </Col>
          </Flex>
          <Flex vertical={isMobile} wrap="wrap">
            {
              //@ts-ignore
              projectData.servers?.map((server) => {
                return (
                  <Col key={server.serverId} style={{ width: isMobile ? "100%" : "50%" }}>
                    <Title level={5} style={{ textAlign: "center" }}>
                      {server.serverName}
                    </Title>
                    <ChartLineServer
                      key={server.serverId}
                      color={projectData.color}
                      server={server}
                    />
                  </Col>
                );
              })
            }
          </Flex>
        </Col>
      )}
    </Row>
  );
};

export { Project };
