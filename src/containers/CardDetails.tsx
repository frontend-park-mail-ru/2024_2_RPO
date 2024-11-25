import {
  setCardDetailsStore,
  useCardDetailsStore,
} from '@/stores/cardDetailsStore';
import './cardDetails.scss';
import { CardDetails, CheckListField } from '@/types/card';
import { ComponentProps } from '@/jsxCore/types';
import { Input } from '@/components/Input';
import {
  addCheckListField,
  assignUser,
  createComment,
  deassignUser,
  deleteCheckListField,
  deleteComment,
  editCheckListField,
} from '@/api/cardDetails';
import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { Button } from '@/components/Button';
import { updateCard } from '@/api/columnsCards';

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

function padZero(num: number) {
  return num.toString().padStart(2, '0');
}

function formatDateToGoTimeString(date: Date) {
  // Убедимся, что переданный объект является экземпляром Date
  if (!(date instanceof Date)) {
    throw new TypeError('Input должен быть экземпляром Date');
  }

  // Получаем компоненты даты в UTC
  const year = date.getUTCFullYear();
  const month = padZero(date.getUTCMonth() + 1); // Месяцы в JS начинаются с 0
  const day = padZero(date.getUTCDate());
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());

  // Формируем строку в формате RFC3339
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

interface CheckListFieldProps extends ComponentProps {
  field: CheckListField;
}

const CheckListFieldComponent = (props: CheckListFieldProps) => {
  const f = props.field;
  return (
    <div class="checklist-field">
      <div
        className={[
          'checklist-field__box',
          f.isDone
            ? 'checklist-field__box__done'
            : 'checklist-field__box__undone',
        ]}
        ON_click={() => {
          editCheckListField(f.id, { isDone: !f.isDone, title: f.title }).then(
            (cf) => {
              if (cf !== undefined) {
                const store = useCardDetailsStore() as CardDetails;
                store.checkList = store.checkList.map((fi) => {
                  if (fi.id !== f.id) {
                    return fi;
                  }
                  console.log(cf);
                  return cf;
                });
                setCardDetailsStore(store);
              }
            }
          );
        }}
      ></div>
      <div class="checklist-field__text">{f.title}</div>
      <div
        style="min-width: 1rem; color: red; cursor: pointer"
        ON_click={() => {
          deleteCheckListField(f.id).then((t) => {
            if (t) {
              const store = useCardDetailsStore() as CardDetails;
              store.checkList = store.checkList.filter((fi) => {
                return fi.id !== f.id;
              });
              setCardDetailsStore(store);
            }
          });
        }}
      >
        <i class="bi-x-lg" />
      </div>
    </div>
  );
};

interface DeadlineProps extends ComponentProps {
  deadline: Date | undefined;
  cardId: number;
}

const DeadlineInput = (props: DeadlineProps) => {
  const [init, setInit] = useState(true);
  const [val, setVal] = useState('');
  useEffectRefs((refs) => {
    if (init) {
      setInit(false);
      const inp = refs.get('deadline') as HTMLInputElement;
      console.log(inp);
      if (props.deadline) {
        const now = props.deadline;
        console.log(now);
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        inp.value = now.toISOString().slice(0, 16);
      }
    }
  });
  return (
    <div>
      <input
        type="datetime-local"
        ref="deadline"
        ON_input={(ev: InputEvent) => {
          const vvv = (ev.target as HTMLInputElement).value;
          console.log(vvv);
          setVal(vvv);
        }}
      />
      <Button
        key="set"
        text="Задать"
        variant="accent"
        callback={() => {
          updateCard(props.cardId, {
            deadline:
              val !== '' ? formatDateToGoTimeString(new Date(val)) : null,
          });
        }}
      />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CardDetailsContainer = (props: ComponentProps) => {
  const cardDetails = useCardDetailsStore() as CardDetails;
  const [newComment, setNewComment] = useState('');
  const [newCheckListField, setNewCheckListField] = useState('');
  const [newAssigned, setNewAssigned] = useState('');

  const addCLF = () => {
    addCheckListField(cardDetails.card.id, newCheckListField).then((clf) => {
      if (clf !== undefined) {
        setNewCheckListField('');
        cardDetails.checkList.push(clf);
        setCardDetailsStore(cardDetails);
      }
    });
  };

  const addComm = () => {
    createComment(cardDetails.card.id, newComment).then((comment) => {
      if (comment !== undefined) {
        setNewComment('');
        cardDetails.comments.push(comment);
        setCardDetailsStore(cardDetails);
      }
    });
  };

  const addAssigned = () => {
    assignUser(cardDetails.card.id, newAssigned).then((u) => {
      if (u !== undefined) {
        setNewAssigned('');
        cardDetails.assignedUsers.push(u);
        setCardDetailsStore(cardDetails);
      }
    });
  };

  return (
    <div class="card-details">
      <div class="card-details__left-section">
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
          placeholder="Новый пункт чеклиста"
          onEnter={addCLF}
          onChanged={(newText) => {
            setNewCheckListField(newText);
          }}
        />
        <Button
          key="checklist_add_btn"
          callback={addCLF}
          text="Добавить пункт чеклиста"
          variant="accent"
        />
        <h1>Комментарии</h1>
        <Input
          key="comment_input"
          placeholder="Напишите Ваш комментарий"
          onEnter={addComm}
          onChanged={setNewComment}
        />
        <Button
          key="comment_btn"
          callback={addComm}
          text="Добавить комментарий"
          variant="accent"
        />
        {cardDetails.comments.map((comment) => {
          return (
            <div className="comment">
              <div className="comment__author">{comment.createdBy.name}</div>

              <div>{comment.text}</div>
              <div
                style="cursor: pointer; color:red"
                ON_click={() => {
                  deleteComment(comment.id).then((t) => {
                    if (t) {
                      cardDetails.comments = cardDetails.comments.filter(
                        (c) => {
                          return c.id !== comment.id;
                        }
                      );
                      setCardDetailsStore(cardDetails);
                    }
                  });
                }}
              >
                <i class="bi-x-lg" />
              </div>
            </div>
          );
        })}
      </div>

      <div class="card-details__right-section">
        <h1>Дедлайн</h1>
        <div>
          Пожалуйста, вводите дату и время! Если Вы не введёте время, оно не
          сработает
        </div>

        <DeadlineInput
          key="deadline_input"
          deadline={cardDetails.card.deadline}
          cardId={cardDetails.card.id}
        />
        <h1>Назначенные пользователи</h1>
        {cardDetails.assignedUsers.map((u) => {
          return (
            <div style="display: flex; flex-direction: row">
              <div>{u.name}</div>
              <div
                style="cursor: pointer; color:red"
                ON_click={() => {
                  deassignUser(cardDetails.card.id, u.id).then((t) => {
                    if (t) {
                      cardDetails.assignedUsers =
                        cardDetails.assignedUsers.filter((au) => {
                          return au.id !== u.id;
                        });
                      setCardDetailsStore(cardDetails);
                    }
                  });
                }}
              >
                <i class="bi-x-lg" />
              </div>
            </div>
          );
        })}
        <Input
          key="assign_user"
          placeholder="Никнейм участника"
          onEnter={addAssigned}
          onChanged={(newText) => {
            setNewAssigned(newText);
          }}
        />
        <Button
          key="assign_user_btn"
          text="Назначить участника"
          variant="accent"
          callback={addAssigned}
        />
      </div>
    </div>
  );
};
