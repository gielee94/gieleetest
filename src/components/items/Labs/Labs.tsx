import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
import '../Category/Category.css';
import { useNavigate } from 'react-router-dom';

interface LabProp {
  labPlanId: {
    subscriptionId: string;
    parent: {
      resourceGroupName: string;
    };
    name: string;
  };
  provisioningState: number;
  state: number;
  title: string;
  virtualMachineProfile: {
    createOption: number;
    imageReference: {
      offer: string;
    };
    sku: {
      name: string;
    };
    usageQuota: string;
  };
  systemData: {
    createdOn: string;
  };
}

const Labs: React.FC = () => {
  const labs = useSelector((state: AppState) => state.labs.data);
  const sortedLabs = labs && [...labs].sort((a, b) => {
    const dateA = new Date(a.systemData.createdOn);
    const dateB = new Date(b.systemData.createdOn);
    return dateB.getTime() - dateA.getTime();
  });

  const [selectedLab, setSelectedLab] = useState<LabProp | null>(null);
  const navigate = useNavigate();


  if (!labs) {
    return null;
  }

  return (
    <div className="category-container">
      <h2 className="category-title">Current Labs</h2>
      <div className="box-container">
        {sortedLabs && sortedLabs.map((lab, index) => {
          const title = lab.title;
          const offer = lab.virtualMachineProfile.imageReference.offer;
          const resourceName = lab.labPlanId.parent.resourceGroupName;
          const skuName = lab.virtualMachineProfile.sku.name;
          const subscriptionId = lab.labPlanId.subscriptionId;

          return (
            <div
              key={index}
              className="box"
              onClick={() => {
                if (
                  !((lab.provisioningState === 0 && lab.state === 0) || (lab.provisioningState === 1 && lab.state === 1))
                ) {
                  window.location.href = `https://labs.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceName}/providers/Microsoft.LabServices/labs/${title}/dashboard`;
                } else {
                  navigate(`/track/${subscriptionId}/${resourceName}/${title}`);
                }
              }}
            >
              <p>
                {lab.provisioningState === 0 && lab.state === 0
                  ? (<div>"Creating" </div>)
                  : lab.provisioningState === 1 && lab.state === 1
                    ? (<div>"Publishing" </div>)
                    : null
                }
              </p>
              <h3>{title}</h3>
              <h5>{lab.virtualMachineProfile.createOption === 1 ? 'Customizable' : 'Non-customizable'}</h5>
              
                <p>{offer}</p>
                <p>{resourceName}</p>
              
              
              <p className="hide">SKU Name: {skuName}</p>
              <p className="hide">Sub: {subscriptionId}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Labs;
