import React, { useState } from "react";
import Styled from "styled-components";

import { IconDragDots, IconBugWarning } from "@Renderer/component/Icon";
import { PageHeader } from "@Renderer/modules/PageHeader";
import { CardDevice } from "@Renderer/component/Card";
import Title from "@Renderer/component/Title";
import { Container } from "react-bootstrap";

import { ReOrderDevicesModal } from "@Renderer/component/Modal";

const DeviceManagerWrapper = Styled.div`
  height: 100%;
  .container-fluid {
    height: 100%;
  }
  .view-wrapper {
    display: flex;
    flex-direction: column;
    height: inherit;
    > div {
      width: 100%;
      flex: initial;
    }
  }
`;

const FilterHeaderWrapper = Styled.div`
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding-top: 32px;
 padding-bottom: 16px;
 margin-bottom: 32px;
 border-bottom: 1px solid ${({ theme }) => theme.colors.gray600};  
 .filter-header {
  display: flex;
  align-items: center;
  grid-gap: 16px;
 }
 .filter-title {
  font-size: 1.5em;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0;
  padding-left: 2px;
  sup {
    color: ${({ theme }) => theme.colors.purple300};
  } 
 }
 .modal-button--trigger {
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray25};
  grid-gap: 8px;
  font-size: 0.8em;
  transition: 300ms ease-in-out color;
  padding: 0;
  background-color: transparent;
  &:hover {
    color: ${({ theme }) => theme.colors.purple100};
  }
}
 .filter-header--tabs ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  grid-gap: 4px;
  .tab {
    border-radius: 16px;
    color: ${({ theme }) => theme.colors.gray25};
    background-color: ${({ theme }) => theme.colors.gray600};
    padding: 4px 16px;
    margin: 0;
    font-family: "Libre Franklin";
    font-weight: 600;
    font-size: 0.8em;
    transition: 300ms background-color ease-in-out;
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray500};
    }
    &.tab-active {
      background-color: ${({ theme }) => theme.colors.purple300};
    }
  }
 }
`;

const DevicesWrapper = Styled.div`
  display: flex;
  grid-gap: 16px;
  position: relative;
  .devices-scroll {
    display: grid;
    grid-template-columns: repeat(3, minmax(340px, 1fr));
    grid-gap: 16px; 
  }
`;
const HelpMessage = Styled.div`
  width: 100%; 
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  .help-wrapper {
    display: flex;
    flex-wrap: nowrap;
    grid-gap: 8px;
    max-width: 224px;
    h4, svg, p {
      transition: 300ms ease-in-out color;
    }
    svg {
      flex: 0 0 24px;
      color: ${({ theme }) => theme.colors.gray25};
    }
    h4 {
      font-size: 1em;
      color: ${({ theme }) => theme.colors.gray25};
    }
    p {
      color: ${({ theme }) => theme.colors.gray200};
      font-size: 0.825em;
    }
    &:hover {
      text-decoration: none;
      h4, svg {
        color: ${({ theme }) => theme.colors.purple100};
      }
      p {
        color: ${({ theme }) => theme.colors.gray50};
      }
    }
  }
`;

const savedDevicesList = [
  {
    name: "Captain Pinky Killer",
    available: true,
    path: "/dev/tty.usbmodem1301",
    file: false,
    device: {
      info: {
        displayName: "Dygma Raise ANSI",
        keyboardType: "ANSI",
        product: "Raise",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ARaise",
  },
  {
    name: "Keeb/Office",
    available: true,
    path: "/dev/tty.usbmodem2201",
    file: false,
    device: {
      info: {
        displayName: "Dygma Defy",
        keyboardType: "Wireless",
        product: "Defy",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ADefyA",
  },
  {
    name: "Keeb/Home",
    available: false,
    path: "/dev/tty.usbmodem2201",
    file: false,
    device: {
      info: {
        displayName: "Dygma Defy",
        keyboardType: "Wireless",
        product: "Defy",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ADefyB",
  },
  {
    path: "/backup/Defy",
    available: true,
    file: true,
    device: {
      info: {
        displayName: "Dygma Defy",
        keyboardType: "Wireless",
        product: "Defy",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ADefyVirtual",
  },
  {
    path: "/backup/Defy",
    available: true,
    file: true,
    device: {
      info: {
        displayName: "Dygma Defy",
        keyboardType: "Wireless",
        product: "Defy",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ADefyVirtual2",
  },
];
const DeviceManager = ({ titleElement, device }) => {
  const [listDevices, setListDevices] = useState(savedDevicesList);
  const [activeTab, setActiveTab] = useState<"all" | boolean>("all");
  const [showModal, setShowModal] = useState(false);

  const addVirtualDevices = (
    <button className="sm button outline transp-bg iconOnNone" type="button" onClick={() => console.log("Add virtual device")}>
      Add virtual device
    </button>
  );
  const scanDevices = (
    <button className="sm button primary iconOnNone" type="button" onClick={() => console.log("Scan devices")}>
      Scan devices
    </button>
  );

  const reOrderList = newList => {
    setListDevices(newList);
    setActiveTab("all");
    setShowModal(false);
  };

  return (
    <DeviceManagerWrapper>
      <Container fluid>
        <div className="view-wrapper">
          <PageHeader text="Device Manager" primaryButton={scanDevices} secondaryButton={addVirtualDevices} />
          <FilterHeaderWrapper>
            <div className="filter-header">
              <h3 className="filter-title">
                My devices <sup>{listDevices.length}</sup>
              </h3>
              <div className="filter-header--tabs">
                <ul>
                  <li>
                    <button
                      type="button"
                      className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("all")}
                    >
                      All
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`tab ${activeTab === true ? "tab-active" : ""}`}
                      onClick={() => setActiveTab(true)}
                    >
                      Online
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`tab ${activeTab === false ? "tab-active" : ""}`}
                      onClick={() => setActiveTab(false)}
                    >
                      Offline
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="filter-header--actions">
              <button type="button" onClick={() => setShowModal(true)} className="modal-button--trigger">
                <IconDragDots />
                Re-order list
              </button>
            </div>
          </FilterHeaderWrapper>
          <DevicesWrapper>
            <div className="devices-container">
              <div className="devices-scroll">
                {listDevices.map(item => (
                  <CardDevice key={item.serialNumber} device={item} filterBy={activeTab} />
                ))}
              </div>
            </div>
          </DevicesWrapper>
          <HelpMessage>
            <a href="https://support.dygma.com/hc/en-us/requests/new" className="help-wrapper">
              <IconBugWarning />
              <div className="help-warning--content">
                <Title text="Need help?" headingLevel={4} />
                <p>Whether it&#39;s a bug or any other issue, we are here to help you!</p>
              </div>
            </a>
          </HelpMessage>
        </div>
      </Container>

      <ReOrderDevicesModal
        show={showModal}
        toggleShow={() => setShowModal(false)}
        devices={listDevices}
        handleSave={reOrderList}
      />
    </DeviceManagerWrapper>
  );
};

export default DeviceManager;
