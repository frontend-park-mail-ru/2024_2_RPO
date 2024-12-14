import {
  setCardDetailsStore,
  useCardDetailsStore,
} from '@/stores/cardDetailsStore';
import './cardDetails.scss';
import { CardDetails, CheckListField } from '@/types/card';
import { ComponentProps } from '@/jsxCore/types';
import { Input } from '@/components/Input';
import {
  addAttachment,
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
import { formatDateToGoTimeString } from '@/utils/misc';
import { showToast } from '@/stores/toastNotificationStore';

const getFileIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'bi-file-earmark-pdf';
    case 'mp3':
    case 'wav':
      return 'bi-file-earmark-music';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'bi-file-earmark-image';
    case 'pptx':
      return 'bi-file-earmark-slides';
    case 'js':
    case 'css':
    case 'cpp':
    case 'go':
      return 'bi-file-earmark-code';
    case 'doc':
    case 'docx':
    case 'odt':
      return 'bi-file-earmark-word';
    case 'txt':
      return 'bi-file-earmark-text';
    default:
      return 'bi-file-earmark';
  }
};

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
                  return cf;
                });
                setCardDetailsStore(store);
              }
            }
          );
        }}
      >
        {f.isDone && <i class="bi-check checklist-field__box-check" />}
      </div>
      <div class="checklist-field__text">{f.title}</div>
      <div
        style="min-width: 1rem; position: relative; top: 2px; color: red; cursor: pointer"
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

  const [commentInput, setCommentInput] = useState(false);
  const [checkListInput, setCheckListInput] = useState(false);
  const [assignedInput, setAssignedInput] = useState(false);

  const addCLF = () => {
    addCheckListField(cardDetails.card.id, newCheckListField).then((clf) => {
      if (clf !== undefined) {
        setNewCheckListField('');
        setCheckListInput(false);
        cardDetails.checkList.push(clf);
        setCardDetailsStore(cardDetails);
      }
    });
  };

  const addComm = () => {
    createComment(cardDetails.card.id, newComment).then((comment) => {
      if (comment !== undefined) {
        setNewComment('');
        setCommentInput(false);
        cardDetails.comments.push(comment);
        setCardDetailsStore(cardDetails);
      }
    });
  };

  const addAssigned = () => {
    assignUser(cardDetails.card.id, newAssigned).then((u) => {
      if (u !== undefined) {
        setNewAssigned('');
        setAssignedInput(false);
        cardDetails.assignedUsers.push(u);
        setCardDetailsStore(cardDetails);
      }
    });
  };

  return (
    <div class="card-details">
      <div class="card-details__left-section">
        <div class="card-details_block">
          <h1 style={cardDetails.checkList.length ? '' : 'display:none'}>
            Чеклист
          </h1>
          {cardDetails.checkList.map((field) => {
            return (
              <CheckListFieldComponent
                key={`component_${field.id}`}
                field={field}
              />
            );
          })}
          {checkListInput ? (
            <div>
              <Input
                key="checklist_input"
                placeholder="Строка чеклиста"
                focusOnInstance
                onEnter={addCLF}
                onEscape={() => {
                  setCheckListInput(false);
                }}
                onChanged={(newText) => {
                  setNewCheckListField(newText);
                }}
              />
              <Button
                icon="bi-check2-square"
                key="checklist_add_btn"
                callback={addCLF}
                text="Добавить строку чеклиста"
                variant="accent"
              />
              <Button
                key="checklist_cancel_add_btn"
                callback={() => {
                  setCheckListInput(false);
                }}
                text="Отмена"
                icon="bi-x-lg"
                variant="default"
              />
            </div>
          ) : (
            <Button
              key="checklist_open_input_btn"
              icon="bi-check2-square"
              callback={() => {
                setCheckListInput(true);
              }}
              text={
                cardDetails.checkList.length
                  ? 'Добавить строку чеклиста'
                  : 'Добавить чеклист'
              }
              variant="default"
            />
          )}
        </div>
        <div class="card-details_block">
          <h1>Комментарии</h1>
          {commentInput ? (
            <>
              <Input
                key="comment_input"
                placeholder="Напишите Ваш комментарий"
                onEnter={addComm}
                focusOnInstance
                onEscape={() => {
                  setCommentInput(false);
                }}
                onChanged={setNewComment}
              />
              <Button
                key="comment_btn"
                callback={addComm}
                text="Добавить комментарий"
                variant="accent"
                icon="bi-chat-left"
              />
              <Button
                key="comment_cancel_add_btn"
                callback={() => {
                  setCommentInput(false);
                }}
                text="Отмена"
                icon="bi-x-lg"
                variant="default"
              />
            </>
          ) : (
            <Button
              key="comment_input_btn"
              callback={() => {
                setCommentInput(true);
              }}
              text="Добавить комментарий"
              variant="default"
              icon="bi-chat-left"
            />
          )}
          {cardDetails.comments.map((comment) => {
            return (
              <div className="comment">
                <div className="comment__avatar">
                  <img
                    src={comment.createdBy.avatarImageUrl}
                    class="comment__avatar-image"
                  />
                </div>
                <div className="comment__content">
                  <div className="comment__author">
                    {comment.createdBy.name}
                  </div>

                  <div>{comment.text}</div>
                  <div
                    style="cursor: pointer; color: red"
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
              </div>
            );
          })}
        </div>
      </div>

      <div class="card-details__right-section">
        <div class="card-details_block">
          <h1>Дедлайн</h1>
          <DeadlineInput
            key="deadline_input"
            deadline={cardDetails.card.deadline}
            cardId={cardDetails.card.id}
          />
        </div>
        <div class="card-details_block">
          <h1>Назначенные пользователи</h1>
          {cardDetails.assignedUsers.map((u) => {
            return (
              <div className="assigned-user">
                <img class="assigned-user__avatar" src={u.avatarImageUrl} />
                <div style="flex-grow: 1; font-weight: bold">{u.name}</div>
                <div
                  style="cursor: pointer; color: red; height: 16px"
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
                  <i class="bi-x-lg assigned-user__remove" />
                </div>
              </div>
            );
          })}
          {assignedInput ? (
            <div>
              <Input
                key="assign_user"
                placeholder="Никнейм участника"
                focusOnInstance
                onEnter={addAssigned}
                onEscape={() => {
                  setAssignedInput(false);
                }}
                onChanged={(newText) => {
                  setNewAssigned(newText);
                }}
              />
              <Button
                key="assign_user_btn"
                text="Назначить участника"
                icon="bi-person-plus"
                variant="accent"
                callback={addAssigned}
              />
              <Button
                key="assign_user_cancel"
                text="Отмена"
                callback={() => {
                  setAssignedInput(false);
                }}
                icon="bi-x-lg"
              />
            </div>
          ) : (
            <Button
              key="assign_user_open_input"
              variant="default"
              text="Назначить участника"
              icon="bi-person-plus"
              callback={() => {
                setAssignedInput(true);
              }}
            />
          )}
        </div>
        <input
          id="upload_attachment"
          type="file"
          style="display:none"
          ON_change={(event: InputEvent) => {
            const files = (event.target as HTMLInputElement).files as FileList;
            addAttachment(cardDetails.card.id, files[0]).then((attachment) => {
              if (attachment !== undefined) {
                showToast('Вложение успешно добавлено!', 'success');
                cardDetails.attachments.push(attachment);
                setCardDetailsStore(cardDetails);
              }
            });
          }}
        />
        <div>
          {cardDetails.attachments.map((attachment) => {
            return (
              <div class="attachment">
                <div>
                  <i class={getFileIcon(attachment.originalName)} />
                </div>
                {attachment.originalName}
              </div>
            );
          })}
        </div>
        <Button
          key="add_attachment"
          text="Добавить вложение"
          icon="bi-paperclip"
          callback={() => {
            const el = document.getElementById(
              'upload_attachment'
            ) as HTMLInputElement;
            el.click();
          }}
        />
      </div>
    </div>
  );
};
