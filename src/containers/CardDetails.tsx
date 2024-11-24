import { useCardDetailsStore } from '@/stores/cardDetailsStore';
import './cardDetails.scss';
import { CardDetails, CheckListField } from '@/types/card';
import { ComponentProps } from '@/jsxCore/types';
import { Input } from '@/components/Input';
import { addCheckListField } from '@/api/cardDetails';

// interface UploadedFile {
//   id: string;
//   name: string;
//   icon: string;
// }
// const getFileIcon = (fileName: string): string => {
//   const ext = fileName.split('.').pop()?.toLowerCase();
//   switch (ext) {
//     case 'pdf':
//       return 'bi-file-earmark-pdf';
//     case 'mp3':
//     case 'wav':
//       return 'bi-file-earmark-music';
//     case 'jpg':
//     case 'jpeg':
//     case 'png':
//     case 'gif':
//       return 'bi-file-earmark-image';
//     case 'pptx':
//       return 'bi-file-earmark-slides';
//     case 'js':
//     case 'css':
//     case 'cpp':
//     case 'go':
//       return 'bi-file-earmark-code';
//     case 'doc':
//     case 'docx':
//     case 'odt':
//       return 'bi-file-earmark-word';
//     case 'txt':
//       return 'bi-file-earmark-text';
//     default:
//       return 'bi-file-earmark';
//   }
// };

interface CheckListFieldProps extends ComponentProps {
  field: CheckListField;
}

const CheckListFieldComponent = (props: CheckListFieldProps) => {
  const f = props.field;
  return <div>{f.title}</div>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CardDetailsContainer = (props: ComponentProps) => {
  const cardDetails = useCardDetailsStore() as CardDetails;
  return (
    <div class="card-details">
      <div class="card-details__left">
        <h2>Чеклист</h2>
        {cardDetails.checkList.map((field) => {
          return (
            <CheckListFieldComponent
              key={`component_${field.id}`}
              field={field}
            />
          );
        })}
        <Input
          key="checklist_input"
          onEnter={(text) => {
            addCheckListField(cardDetails.card.id, text).then((clf) => {
              if (clf !== undefined) {
                cardDetails.checkList.push(clf);
              }
            });
          }}
        />
      </div>
      <div class="card-details__right"></div>
    </div>
  );
};
