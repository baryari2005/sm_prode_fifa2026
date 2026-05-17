"use client";

import { useJugadorPlantelForm } from "../hooks/useJugadorPlantelForm";
import { PlayerBaseFields } from "./PlayerBaseFields";
import { PlayerDetailsFields } from "./PlayerDetailsFields";
import { PlayerPhotoUploader } from "./PlayerPhotoUploader";
import { PlayerStatsFields } from "./PlayerStatsFields";
import { SeleccionSelect } from "./SeleccionSelect";
import { SubmitJugadorButton } from "./SubmitJugadorButton";
import { SectionDivider } from "./FormFields";
import { JugadorPlantelFormProps } from "../types/types";

export function JugadorPlantelForm(props: JugadorPlantelFormProps) {
  const {
    form,
    submitting,
    uploading,
    dragActive,
    fileInputRef,
    isEditMode,
    selectedSeleccion,
    updateField,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSubmit,
  } = useJugadorPlantelForm(props);

  return (
    <div className="space-y-5">
      <div className="grid gap-5">
        <SeleccionSelect
          value={form.seleccionId}
          selecciones={props.selecciones}
          selectedSeleccion={selectedSeleccion}
          onChange={(value) => updateField("seleccionId", value)}
        />

        <PlayerBaseFields form={form} updateField={updateField} />

        <SectionDivider />

        <PlayerDetailsFields form={form} updateField={updateField} />

        <SectionDivider />

        <PlayerPhotoUploader
          form={form}
          uploading={uploading}
          dragActive={dragActive}
          fileInputRef={fileInputRef}
          updateField={updateField}
          onFileInputChange={(event) => void handleFileInputChange(event)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(event) => void handleDrop(event)}
        />

        {isEditMode ? (
          <PlayerStatsFields form={form} updateField={updateField} />
        ) : null}
      </div>

      <SubmitJugadorButton
        mode={props.mode}
        submitting={submitting}
        uploading={uploading}
        onSubmit={() => void handleSubmit()}
      />
    </div>
  );
}
