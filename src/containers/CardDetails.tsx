import {
  setCardDetailsStore,
  useCardDetailsStore,
} from '@/stores/cardDetailsStore';
import './cardDetails.scss';
import { CardDetails, CheckListField } from '@/types/types';
import { ComponentProps } from '@/jsxCore/types';
import { Input } from '@/components/Input';
import {
  addAttachment,
  addCheckListField,
  addCover,
  assignUser,
  createComment,
  deassignUser,
  deleteAttachment,
  deleteCheckListField,
  deleteComment,
  deleteCover,
  editCheckListField,
  getCardDetails,
} from '@/api/cardDetails';
import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { Button } from '@/components/Button';
import { updateCard } from '@/api/columnsCards';
import { formatDateToGoTimeString, truncateFileName } from '@/utils/misc';
import { showToast } from '@/stores/toastNotificationStore';
import { downloadFile } from '@/utils/download';
import { loadBoard, useActiveBoardStore } from '@/stores/activeBoardStore';
import { SelectBox } from '@/components/SelectBox';
import { Tag } from '@/api/responseTypes';
import { attachTagToCard, removeTagFromCard } from '@/api/tags';

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
        class="checklist-field__close"
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
  closeCallback: () => void;
}

export const reloadContent = () => {
  loadBoard(useActiveBoardStore()?.board.id, true);
  setTimeout(() => {
    const cardDetails = useCardDetailsStore();
    if (cardDetails !== undefined) {
      getCardDetails(cardDetails.card.id).then((cardDetails) => {
        if (cardDetails !== undefined) {
          setCardDetailsStore(cardDetails);
        }
      });
    }
  }, 40);
};

const DeadlineInput = (props: DeadlineProps) => {
  const [init, setInit] = useState(true);
  const [val, setVal] = useState('');
  useEffectRefs((refs) => {
    if (init) {
      setInit(false);
      const inp = refs.get('deadline') as HTMLInputElement;
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
          setVal(vvv);
        }}
      />
      <Button
        key="set"
        text="Задать"
        icon="bi-clock"
        fullWidth
        variant="accent"
        callback={() => {
          updateCard(props.cardId, {
            deadline:
              val !== '' ? formatDateToGoTimeString(new Date(val)) : null,
          }).then(() => {
            reloadContent();
            showToast('Успешно обновлён дедлайн!', 'success');
            props.closeCallback();
          });
        }}
      />
      <Button
        key="deadline_cancel_btn"
        icon="bi-x-lg"
        variant="default"
        fullWidth
        text="Отмена"
        callback={props.closeCallback}
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
  const [deadlineInput, setDeadlineInput] = useState(false);
  const [checkListInput, setCheckListInput] = useState(false);
  const [assignedInput, setAssignedInput] = useState(false);
  const [linkOpened, setLinkOpened] = useState(false);

  const activeBoard: { myRole: string; tags: Tag[] } =
    useActiveBoardStore() ?? {
      myRole: 'viewer',
      tags: [],
    };

  const addCLF = () => {
    if (newCheckListField.length < 3) {
      showToast('Строка чеклиста должна быть от 3 символов', 'error');
      return;
    }
    addCheckListField(cardDetails.card.id, newCheckListField).then((clf) => {
      if (clf !== undefined) {
        setNewCheckListField('');
        setCheckListInput(false);
        reloadContent();
      }
    });
  };

  const addComm = () => {
    if (newComment.length < 3) {
      showToast('Комментарий должен быть от 3 символов', 'error');
      return;
    }
    createComment(cardDetails.card.id, newComment).then((comment) => {
      if (comment !== undefined) {
        setNewComment('');
        setCommentInput(false);
        reloadContent();
      }
    });
  };

  const addAssigned = () => {
    if (newAssigned.length < 3) {
      if (newComment.length < 3) {
        showToast('Имя польователя может быть от 3 символов', 'error');
        return;
      }
    }
    assignUser(cardDetails.card.id, newAssigned).then((u) => {
      if (u !== undefined) {
        setNewAssigned('');
        reloadContent();
      }
    });
  };

  return (
    <div style="min-width: 500px">
      <div style="margin-bottom: 15px">{cardDetails.card.title}</div>
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
                  fullWidth
                  callback={addCLF}
                  text="Добавить строку чеклиста"
                  variant="accent"
                />
                <Button
                  key="checklist_cancel_add_btn"
                  fullWidth
                  callback={() => {
                    setCheckListInput(false);
                  }}
                  text="Отмена"
                  icon="bi-x-lg"
                  variant="default"
                />
              </div>
            ) : (
              activeBoard?.myRole !== 'viewer' && (
                <Button
                  key="checklist_open_input_btn"
                  icon="bi-check2-square"
                  fullWidth
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
              )
            )}
          </div>
          <div class="card-details_block">
            {cardDetails.comments.length && <h1>Комментарии</h1>}
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
                  fullWidth
                  callback={addComm}
                  text="Добавить комментарий"
                  variant="accent"
                  icon="bi-chat-left"
                />
                <Button
                  key="comment_cancel_add_btn"
                  fullWidth
                  callback={() => {
                    setCommentInput(false);
                  }}
                  text="Отмена"
                  icon="bi-x-lg"
                  variant="default"
                />
              </>
            ) : (
              activeBoard?.myRole !== 'viewer' && (
                <Button
                  key="comment_input_btn"
                  fullWidth
                  callback={() => {
                    setCommentInput(true);
                  }}
                  text="Добавить комментарий"
                  variant="default"
                  icon="bi-chat-left"
                />
              )
            )}
            {cardDetails.comments.map((comment) => {
              return (
                <div
                  className="comment"
                  style="max-width: 100%; text-wrap: wrap"
                >
                  <div className="comment__avatar">
                    <img
                      src={comment.createdBy.avatarImageUrl}
                      class="comment__avatar-image"
                    />
                  </div>
                  <div className="comment__content" style="overflow: hidden">
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

          {(cardDetails.card.tags.length > 0 ||
            activeBoard.myRole !== 'viewer') && <h2>Теги</h2>}
          {cardDetails.card.tags.map((tag) => {
            const realTag = activeBoard.tags.find((t) => {
              return t.id === tag;
            });
            if (realTag === undefined) {
              return <div>Ошибка</div>;
            }
            return (
              <div class="tag__entry">
                <div
                  class="tag__circle"
                  style={`background-color: ${realTag.color}`}
                ></div>
                <div style="flex-grow:1">{realTag.text}</div>
                {activeBoard.myRole !== 'viewer' && (
                  <div
                    class="tag__remove"
                    ON_click={() => {
                      removeTagFromCard(cardDetails.card.id, realTag.id).then(
                        (ok) => {
                          if (ok) {
                            showToast('Успешно откреплён тег!', 'success');
                            reloadContent();
                          }
                        }
                      );
                    }}
                  >
                    <i class="bi-x-lg" />
                  </div>
                )}
              </div>
            );
          })}
          {activeBoard.myRole !== 'viewer' && (
            <SelectBox
              key="select_add_tag"
              currentIndex={0}
              widthRem={12}
              onChange={(newIndex) => {
                attachTagToCard(
                  cardDetails.card.id,
                  activeBoard.tags[newIndex - 1].id
                ).then((ok) => {
                  if (ok) {
                    showToast('Добавлен тег!', 'success');
                    reloadContent();
                  }
                });
              }}
              options={[
                { icon: 'bi-tags', title: 'Добавить тег' },
                ...activeBoard.tags.map((tag) => {
                  return {
                    icon: 'bi-tag',
                    title: tag.text,
                  };
                }),
              ]}
            />
          )}
        </div>

        <div class="card-details__right-section">
          <div class="card-details_block">
            {cardDetails.card.deadline !== undefined && <h1>Дедлайн</h1>}
            {cardDetails.card.deadline !== undefined && (
              <div class="deadline-block">
                <div style="flex-grow: 1">
                  {cardDetails.card.deadline.toLocaleString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </div>
                <div class="deadline-block__close">
                  <i class="bi-x-lg" />
                </div>
              </div>
            )}
            {deadlineInput && (
              <DeadlineInput
                key="deadline_input"
                deadline={cardDetails.card.deadline}
                cardId={cardDetails.card.id}
                closeCallback={() => {
                  setDeadlineInput(false);
                }}
              />
            )}
            {!deadlineInput && activeBoard?.myRole !== 'viewer' && (
              <Button
                key="open_deadline_input_btn"
                icon="bi-clock"
                fullWidth
                text={
                  cardDetails.card.deadline
                    ? 'Сменить дедлайн'
                    : 'Добавить дедлайн'
                }
                callback={() => {
                  setDeadlineInput(true);
                }}
              />
            )}
          </div>
          <div class="card-details_block">
            {cardDetails.assignedUsers.length && (
              <h1>Назначенные пользователи</h1>
            )}
            {cardDetails.assignedUsers.map((u) => {
              return (
                <div className="assigned-user">
                  <img class="assigned-user__avatar" src={u.avatarImageUrl} />
                  <div style="flex-grow: 1; font-weight: bold">{u.name}</div>
                  {activeBoard?.myRole !== 'viewer' && (
                    <div
                      style="cursor: pointer; color: red; height: 16px"
                      ON_click={() => {
                        deassignUser(cardDetails.card.id, u.id).then((t) => {
                          if (t) {
                            showToast(
                              'Пользователь отстранён от данной задачи!',
                              'success'
                            );
                            reloadContent();
                          }
                        });
                      }}
                    >
                      <i class="bi-x-lg assigned-user__remove" />
                    </div>
                  )}
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
                  fullWidth
                  icon="bi-person-plus"
                  variant="accent"
                  callback={addAssigned}
                />
                <Button
                  key="assign_user_cancel"
                  fullWidth
                  text="Отмена"
                  callback={() => {
                    setAssignedInput(false);
                  }}
                  icon="bi-x-lg"
                />
              </div>
            ) : (
              activeBoard?.myRole !== 'viewer' && (
                <Button
                  key="assign_user_open_input"
                  variant="default"
                  text="Назначить участника"
                  fullWidth
                  icon="bi-person-plus"
                  callback={() => {
                    setAssignedInput(true);
                  }}
                />
              )
            )}
          </div>
          <input
            id="upload_attachment"
            type="file"
            style="display:none"
            ON_change={(event: InputEvent) => {
              const files = (event.target as HTMLInputElement)
                .files as FileList;
              addAttachment(cardDetails.card.id, files[0]).then(
                (attachment) => {
                  if (attachment !== undefined) {
                    showToast('Вложение успешно добавлено!', 'success');
                    reloadContent();
                  }
                }
              );
            }}
          />
          {cardDetails.attachments.length > 0 && <h2>Вложения</h2>}
          <div>
            {cardDetails.attachments.map((attachment) => {
              return (
                <div
                  class="attachment"
                  ON_click={() => {
                    downloadFile(attachment.fileName, attachment.originalName);
                  }}
                >
                  <div>
                    <i class={getFileIcon(attachment.originalName)} />
                  </div>
                  <div style="flex-grow:1">
                    {truncateFileName(attachment.originalName)}
                  </div>
                  {activeBoard?.myRole !== 'viewer' && (
                    <div
                      class="attachment__remove"
                      ON_click={(ev: Event) => {
                        ev.stopImmediatePropagation();
                        deleteAttachment(attachment.id).then(() => {
                          reloadContent();
                          showToast('Успешно удалено вложение!', 'success');
                        });
                      }}
                    >
                      <i class="bi-trash" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {activeBoard?.myRole !== 'viewer' && (
            <Button
              key="add_attachment"
              text="Добавить вложение"
              icon="bi-paperclip"
              fullWidth
              callback={() => {
                const el = document.getElementById(
                  'upload_attachment'
                ) as HTMLInputElement;
                el.click();
              }}
            />
          )}
          {linkOpened ? (
            <div>
              <Input
                key="card_link_showdown"
                initialValue={`${window.location.origin}/card/${cardDetails.card.linkUuid}`}
              />
              <Button
                key="copy_card_link_btn"
                variant="accent"
                icon="bi-copy"
                text="Скопировать ссылку"
                fullWidth
                callback={() => {
                  navigator.clipboard
                    .writeText(
                      `${window.location.origin}/card/${cardDetails.card.linkUuid}`
                    )
                    .then(() => {
                      showToast('Ссылка успешно скопирована!', 'success');
                    });
                }}
              />
            </div>
          ) : (
            <Button
              key="open_link_button"
              variant="default"
              icon="bi-share"
              text="Ссылка на карточку"
              fullWidth
              callback={() => {
                setLinkOpened(true);
              }}
            />
          )}
          <input
            id="upload_cover"
            type="file"
            accept="image/*"
            style="display:none"
            ON_change={(event: InputEvent) => {
              const files = (event.target as HTMLInputElement)
                .files as FileList;
              addCover(cardDetails.card.id, files[0]).then((attachment) => {
                if (attachment !== undefined) {
                  showToast('Обложка успешно добавлена!', 'success');
                  reloadContent();
                }
              });
            }}
          />
          {activeBoard?.myRole !== 'viewer' && (
            <Button
              key="add_cover"
              text={
                !cardDetails.card.coverImageUrl
                  ? 'Добавить обложку'
                  : 'Удалить обложку'
              }
              icon={
                !cardDetails.card.coverImageUrl ? 'bi-paperclip' : 'bi-x-lg'
              }
              fullWidth
              callback={() => {
                if (cardDetails.card.coverImageUrl) {
                  deleteCover(cardDetails.card.id).then(() => {
                    showToast('Обложка удалена!', 'success');
                    reloadContent();
                  });
                } else {
                  const el = document.getElementById(
                    'upload_cover'
                  ) as HTMLInputElement;
                  el.click();
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
