"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SourceSelector from "./SourceSelector";
import UploadField from "./UploadField";
import PreviewPdfTable from "./PreviewPdfTable";
import PreviewExcelTable from "./PreviewExcelTable";
import CredentialsTable from "./CredentialsTable";
import ExcelHeadersDialog from "./ExcelHeadersDialog";
import ImportUsersErrors from "./ImportUsersErrors";
import { useImportUsers } from "../hooks/useImportUsers";
import { ImportUserHeader } from "./ImportUserHeader";

export default function ImportUsersView() {
  const {
    source,
    rows,
    excelRows,
    loading,
    creds,
    rowErrors,
    showHeadersModal,
    acceptBySource,
    setSource,
    setShowHeadersModal,
    clearData,
    handleUploadPdf,
    handleUploadExcel,
    handleCreatePdfAll,
    handleCreateExcelAll,
    downloadCSV,
  } = useImportUsers();

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <ImportUserHeader />

          <SourceSelector
            source={source}
            setSource={setSource}
            clearData={clearData}
          />

          <UploadField
            source={source}
            accept={acceptBySource}
            onPdfUpload={handleUploadPdf}
            onExcelUpload={handleUploadExcel}
            onOpenHeaders={() => setShowHeadersModal(true)}
          />

          {source === "pdf" ? (
            <PreviewPdfTable
              rows={rows}
              loading={loading}
              onCreateAll={handleCreatePdfAll}
            />
          ) : (
            <PreviewExcelTable
              rows={excelRows}
              loading={loading}
              onCreateAll={handleCreateExcelAll}
            />
          )}

          <ImportUsersErrors errors={rowErrors} />

          <Separator />

          <CredentialsTable creds={creds} onDownload={downloadCSV} />
        </CardContent>
      </Card>

      <ExcelHeadersDialog
        open={showHeadersModal}
        onOpenChange={setShowHeadersModal}
      />
    </div>
  );
}
