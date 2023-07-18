import React from "react";

// Bootstrap components
import Styled from "styled-components";
import Card from "react-bootstrap/Card";

// Modules
import { AdvancedBatterySettings, SavingMode } from "../Battery";
// Internal components
import Title from "../../component/Title";
import { IconFlashlight } from "../../component/Icon";

const Styles = Styled.div`
padding-top: 24px;
.card {
  height: inherit;
}
.battery-defy--indicator {
  display: flex;
  grid-gap: 8px;
  margin-bottom: 42px;
  position: relative;
  max-width: 202px;
}
.custom-switch {
  min-height: 36px;
}
.savingModedescription {
  margin-top: 24px;
  p {
    font-size: 0.75rem;
    font-weight: 401;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.styles.batterySettings.descriptionColor};
    strong {
      font-weight: 401;
      color: ${({ theme }) => theme.styles.batterySettings.descriptionHighlightColor};
    }
  }
}
`;

interface EnergyManagementProps {
  wireless: {
    battery: {
      LeftLevel?: number;
      LeftState?: number;
      RightLevel?: number;
      RightState?: number;
      savingMode?: boolean;
    };
  };
  toggleSavingMode: Promise<void>;
}

function EnergyManagement({ wireless, toggleSavingMode }: EnergyManagementProps) {
  return (
    <Styles>
      <Card className="overflowFix card-preferences">
        <Card.Title>
          <Title text="Energy management" headingLevel={3} svgICO={<IconFlashlight />} />
        </Card.Title>
        <Card.Body className="py-0">
          <AdvancedBatterySettings />
          <SavingMode wireless={wireless} toggleSavingMode={toggleSavingMode} />
        </Card.Body>
      </Card>
    </Styles>
  );
}

export default EnergyManagement;