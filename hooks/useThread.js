import { useEffect, useState } from "react";
import { Thread } from 'react-native-threads';

export function useThread(){
    const [thread, setThread] = useState(null)

    useEffect(() => {
        setThread(new Thread('../thread/thread.js'));
        return () => {
          thread.terminate();
          thread = null;
        }
      }, [])
    
      return thread
}