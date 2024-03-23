import { FC } from "react";
import { Col, Row, Typography, Flex } from "antd";

import { ChartColumnCurrentAmount } from "../../widgets/chartColumnCurrentAmount";

const Home: FC = () => {
  const { Title } = Typography;
  return (
    <>
      <Row justify={"center"}>
        <Col lg={{ span: 12 }} style={{ height: 320 }} flex="auto">
          <Flex justify="center" gap="middle" vertical align="center">
            <Title level={3}>Столбчатая диаграмма</Title>
          </Flex>
          <ChartColumnCurrentAmount />
        </Col>
      </Row>
    </>
  );
};

export { Home };
