import { Row, Col, Button, Flex } from "antd";
import { FC, useState } from "react";
import { NavBox } from "../../shared/ui";
import { ENavBox } from "../../shared/ui/NavBox/types";
import { AddProject, DeleteProject } from "../../features/projects";

const Admin: FC = () => {
  const [boxActive, setBoxActive] = useState<ENavBox>(ENavBox.create);

  return (
    <Row
      justify={{
        lg: "start",
        xs: "center",
      }}
    >
      <Col>
        <Flex gap={20} vertical>
          <Flex gap={10}>
            <Button onClick={() => setBoxActive(ENavBox.create)}>
              Добавить проект
            </Button>
            <Button onClick={() => setBoxActive(ENavBox.delete)}>
              Удалить проект
            </Button>
          </Flex>
          <Flex>
            <NavBox nameBox={ENavBox.delete} boxActive={boxActive}>
              <DeleteProject />
            </NavBox>
            <NavBox nameBox={ENavBox.create} boxActive={boxActive}>
              <AddProject />
            </NavBox>
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
};

export { Admin };
