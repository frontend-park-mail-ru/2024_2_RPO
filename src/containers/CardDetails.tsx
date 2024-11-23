// import { ModalDialog } from '@/components/ModalDialog';
// import { closeBoardSettingsModalDialog } from '@/stores/modalDialogsStore';
// import { Button } from '@/components/Button';
// import { SelectBox, SelectBoxOption } from '@/components/SelectBox';
// import {
//   setActiveBoardStore,
//   useActiveBoardStore,
// } from '@/stores/activeBoardStore';
// import { Input } from '@/components/Input';
// import { addMember, removeMember, updateMember } from '@/api/members';
// import { ActiveBoard } from '@/types/activeBoard';
// import { setMembersStore, useMembersStore } from '@/stores/members';
// import { showToast } from '@/stores/toastNotificationStore';
// import { useMeStore } from '@/stores/meStore';
// import { User } from '@/types/user';
// import { goToUrl } from '@/stores/routerStore';
// import { deleteBoard, setBoardBackgroundImage } from '@/api/boards';
// import { useState } from '@/jsxCore/hooks';
// import './cardDetails.scss';

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

// export const FileUpload = () => {
//   const [files, setFiles] = useState<UploadedFile[]>([]);

//   const handleFileChange = (event: InputEvent) => {
//     const input = event.target as HTMLInputElement;
//     if (!input.files) return;

//     const newFiles = Array.from(input.files).map((file) => ({
//       id: Math.random().toString(36).substring(2, 9),
//       name: file.name,
//       icon: getFileIcon(file.name),
//     }));

//     setFiles((prev) => [...prev, ...newFiles]);
//     showToast('Файлы успешно добавлены', 'success');
//   };

//   const removeFile = (id: string) => {
//     setFiles((prev) => prev.filter((file) => file.id !== id));
//     showToast('Файл удалён', 'info');
//   };
// }

// export const CardSettings = () => {
//   const activeBoard = useActiveBoardStore() as ActiveBoard;
//   const me = useMeStore() as User;
//   const members = useMembersStore();
// //   const [memberNickname, setMemberNickname] = useState('');
// //   const submitMember = (nickname: string) => {
// //     if (memberNickname.length === 0) {
// //       return;
// //     }
// //     addMember(activeBoard.id, nickname).then((newMember) => {
// //       showToast('Успешно назначен пользователь', 'success');
// //       members.push(newMember);
// //       setMembersStore(members);
// //     });

//   };
// function removeFile(id: any): void {
//   throw new Error('Function not implemented.');
// }

//   return (
//     <ModalDialog
//       key="modal_dialog"
//       title="Подробности карточки"
//       isOpened={true}
//       closeCallback={closeCardDetailsModalDialog}
//     >
//       <div class="card-details">
//         <div class="card-details__upper-section">
//           <div class="card-details__left">

//           <div class="file-upload">
//             <input
//               id="fileInput"
//               type="file"
//               style="display: none"
//               multiple
//               ON_change={handleFileChange}
//             />
//             <Button
//               icon="bi-upload"
//               text="Добавить файлы"
//               variant="accent"
//               callback={() => {
//                 const input = document.getElementById('fileInput') as HTMLInputElement;
//                 input.click();
//               }}
//             />
//             <div class="file-container">
//               {files.map((file) => (
//                 <div class="file-item" key={file.id}>
//                   <i class={`bi ${file.icon} file-item__icon`}></i>
//                   <span class="file-item__name">{file.name}</span>
//                   <Button
//                     icon="bi-x-lg"
//                     variant="negative"
//                     callback={() => removeFile(file.id)} key={''}                  />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//             {activeBoard.myRole !== 'admin' &&
//               activeBoard.myRole !== 'editor' && (
//                 <Button
//                   key="add_file_btn"
//                   fullWidth
//                   text="Добавить вложение"
//                   variant="accent"
//                   icon="bi-paperclip"
//                   callback={() => {
//                     const el = document.getElementById(
//                       'uploadbg'
//                     ) as HTMLInputElement;
//                     el.click();
//                   }}
//                 />
//               )}

//             {activeBoard.myRole === 'admin' && (
//               <Button
//                 key="delete_btn"
//                 fullWidth
//                 text="Удалить вложение"
//                 icon="bi-trash"
//                 variant="negative"
//                 callback={() => {
//                   deleteBoard(activeBoard.id).then(() => {
//                     showToast('Вложение успешно удалено', 'success');
//                     closeBoardSettingsModalDialog();
//                     goToUrl('/app');
//                   });
//                 }}
//               />
//             )}
//           </div>
//           <div class="board-settings__add-participants">
//             <div class="add-participiants__text">Добавить исполниетелей</div>
//             <div class="add-participiants__main">
//               <div class="main__add-collaborator-text">Добавить зрителя:</div>
//               <div class="main__add-collaborator-input">
//                 <Input
//                   key="add_member_inp"
//                   placeholder="Введите никнейм"
//                   onChanged={setMemberNickname}
//                   onEnter={() => {
//                     submitMember(memberNickname);
//                   }}
//                 />
//               </div>
//               <Button
//                 key="add_member"
//                 icon="bi-plus-square"
//                 variant={memberNickname.length ? 'positive' : 'default'}
//                 callback={() => {
//                   submitMember(memberNickname);
//                 }}
//               />

//             </div>
//           </div>
//         </div>
//         <div class="permissions-table">
//           <div class="permissions-table__title">Права пользователей</div>
//           <hr class="mb-16px" />
//           <div class="permissions-table__table">
//             <div class="permissions-table__table__headers">Имя</div>
//             <div class="permissions-table__table__headers">Добавил</div>
//             <div class="permissions-table__table__headers">Роль</div>
//             {members.map((user) => {
//               return (
//                 <>
//                   <div class="permissions-table__table__user">
//                     <img
//                       src={user.user.avatarImageUrl}
//                       alt=""
//                       class="navbar__profile-picture"
//                     />
//                     <div class="permissions-table__table__user-title">
//                       {user.user.name}
//                     </div>
//                   </div>
//                   <div class="permissions-table__table__user-add">
//                     {user.addedBy.name}
//                   </div>
//                   <div class="permissions-table__table__editor">
//                     <SelectBox
//                       key={`edit_member_${user.user.id}`}
//                       options={modeOptionsRedactor}
//                       widthRem={12}
//                       readOnly={
//                         !(
//                           activeBoard.myRole === 'admin' ||
//                           (activeBoard.myRole === 'editor_chief' &&
//                             user.role !== 'admin' &&
//                             user.role !== 'editor_chief')
//                         ) || user.user.id === me.id
//                       }
//                       currentIndex={[
//                         'viewer',
//                         'editor',
//                         'editor_chief',
//                         'admin',
//                       ].indexOf(user.role)}
//                       onChange={(newIndex) => {
//                         if (user.user.id === me.id) {
//                           return;
//                         }
//                         updateMember(
//                           activeBoard.id,
//                           user.user.id,
//                           ['viewer', 'editor', 'editor_chief', 'admin'][
//                             newIndex
//                           ]
//                         ).then((patch) => {
//                           showToast('Успешно обновлена роль', 'success');
//                           setMembersStore(
//                             members.map((e) => {
//                               return e.user.id !== user.user.id ? e : patch;
//                             })
//                           );
//                         });
//                       }}
//                     />
//                   </div>
//                   {user.user.id === me.id ||
//                   !(
//                     activeBoard.myRole === 'admin' ||
//                     (activeBoard.myRole === 'editor_chief' &&
//                       user.role !== 'admin' &&
//                       user.role !== 'editor_chief')
//                   ) ||
//                   user.user.id === me.id ? (
//                     <div></div>
//                   ) : (
//                     <div class="permissions-table__kick-member-button">
//                       <Button
//                         key={`remove_member_${user.user.id}`}
//                         icon="bi-x-lg"
//                         variant="default"
//                         callback={() => {
//                           if (user.user.id === me.id) {
//                             return;
//                           }
//                           removeMember(activeBoard.id, user.user.id).then(
//                             () => {
//                               showToast(
//                                 'Успешно изгнан пользователь',
//                                 'success'
//                               );
//                               setMembersStore(
//                                 members.filter((a) => {
//                                   return a.user.id !== user.user.id;
//                                 })
//                               );
//                             }
//                           );
//                         }}
//                       />
//                     </div>
//                   )}
//                 </>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </ModalDialog>
//   );
// };
