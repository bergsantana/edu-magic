"use client"
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useEffect, useState } from "react";
import {  Pencil } from "lucide-react";

export default function ActivitySelector({
  activities,
  setActivities,
}: {
  activities: { name: string; subtitle: string; disabled?: boolean }[];
  setActivities: (activities: number[]) => void;
}) {
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedActivities([...selectedActivities, index]);
    } else {
      setSelectedActivities(selectedActivities.filter((i) => i !== index));
    }

  };
  
  useEffect(() => {
    setActivities(selectedActivities);
  }, [selectedActivities, setActivities]);
  return (
    <div>
      <Label>Selecione atividades:</Label>
      <div className="flex  flex-wrap space-y-2 mt-2 gap-2">
        {activities.map((activity, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between h-24  w-80 items-start space-x-2 p-2   bg-gray-300 rounded-2xl  ${
              activity.disabled ? "  text-gray-200" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex gap-2 w-full  ">
              <Checkbox
                id={`activity-${index}`}
                checked={selectedActivities.includes(index)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(index, !!checked)
                }
                disabled={activity.disabled}
                className="mt-2   bg-white "
              />
              <Label
                htmlFor={`activity-${index}`}
                className={`flex-1 cursor-pointer text-xl ${
                  activity.disabled ? "text-gray-600" : "text-gray-900"
                }`}
              >
                {activity.name} {activity.disabled && "(Em breve)"}
              </Label>
              <Pencil className="self-start  " />
            </div>
            <span className="text-xs text-gray-600">{activity.subtitle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
