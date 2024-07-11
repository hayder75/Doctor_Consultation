import { useEffect, useRef, useState } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";

const Messages = () => {
  const { messages, refetch } = useGetMessages();
  const [oldMessages, setOldMessages] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const lastMessageRef = useRef();

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const initialMessages = await refetch();
      setOldMessages(initialMessages);
      setInitialLoading(false);
    };

    fetchInitialMessages();
  }, [refetch]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newMessages = await refetch();

      // Compare oldMessages and newMessages
      if (JSON.stringify(newMessages) !== JSON.stringify(oldMessages)) {
        setOldMessages(newMessages);
      }
    }, 3000); // Interval set to 3 seconds

    return () => clearInterval(interval);
  }, [oldMessages, refetch]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [oldMessages]);

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {initialLoading &&
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!initialLoading && oldMessages.length > 0 &&
        oldMessages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {!initialLoading && oldMessages.length === 0 && (
        <p className='text-center'>Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;
