import React, {FC, useState} from 'react';
import {Text, View, StyleSheet, Dimensions, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../assets/colors';
import {selectAnswers} from '../redux/answer/answerSelector';
import {Comment, setComment} from '../redux/comment/commentReducer';
import {Note} from '../redux/note/noteReducer';
import {addComment} from '../redux/note/singleNoteReducer';
import {useAppDispatch} from '../redux/reduxStore';
import AddInput from './AddInput';
import CommentCard from './CommentCard';
import DialogModal from './DialogModal';

interface FullNoteProps {
  note: Note;
  noteComments?: Array<Comment>;
}
const FullNote: FC<FullNoteProps> = ({note, noteComments}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const answers = useSelector(selectAnswers);
  const dispatch = useAppDispatch();

  const addCommentHandler = (title: string, text: string) => {
    const newComment = {
      id: Math.random().toString(),
      title,
      text,
      date: new Date().toString(),
      parentId: note.id,
    };
    dispatch(setComment(newComment));
    dispatch(addComment(newComment.id));
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={() => setModalVisible(true)}>
        <View style={styles.noteContainer}>
          <Text style={styles.date}>
            {new Date(note.date).toLocaleString('ru', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.text}>{note.text}</Text>
        </View>
      </Pressable>
      {noteComments && noteComments.length > 0 ? (
        noteComments.map(comment => {
          const commentAnswers = answers.filter(i => i.parentId === comment.id);
          return (
            <CommentCard
              comment={comment}
              key={comment.id}
              commentAnswers={commentAnswers}
            />
          );
        })
      ) : (
        <View style={styles.line} />
      )}
      <DialogModal
        visible={modalVisible}
        setVisible={setModalVisible}
        title={`Коментировать "${note.title}"`}>
        <AddInput addFunc={addCommentHandler} />
      </DialogModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width - 60,
  },
  noteContainer: {
    paddingTop: 10,
    paddingBottom: 27,
    paddingHorizontal: 17,
    width: Dimensions.get('window').width - 60,
  },
  line: {
    borderBottomColor: colors.borderCard,
    borderBottomWidth: 1,
    width: Dimensions.get('window').width - 60,
  },
  date: {
    fontSize: 8,
    fontWeight: '300',
    color: colors.greyDate,
    textAlign: 'right',
    marginBottom: 9,
  },
  text: {
    fontSize: 10,
    fontWeight: '300',
    color: colors.black,
  },
});

export default FullNote;
